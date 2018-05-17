import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import CloseIcon from 'material-ui/svg-icons/navigation/cancel';
import IconButton from 'material-ui/IconButton';
import PropTypes from 'prop-types';
import ApiErrorSnackbar from '../ApiErrorSnackbar';
import makeCancellable from '../../promiseWrapper';
import makeCancellableVal from '../../valueWrapper';

class IngredientBox extends Component {

    static propTypes = {
        ingredientName: PropTypes.string.isRequired,
        ingredientID: PropTypes.number.isRequired,
        reload: PropTypes.func.isRequired,
        logout: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            removeFoodAwaitingResponse: false,
            removeFoodError: false,

            cancellablePromise: undefined
        };
    }

    componentWillUnmount = () => {
        if (this.state.cancellablePromise) this.state.cancellablePromise.cancel();
    }

    getCancellableFetch = () => {
        let cancellable = makeCancellable(fetch(`/api/cupboard/remove/${this.props.ingredientID}`, {
            method: 'DELETE',
            credentials: 'same-origin',
        }));
        
        cancellable
            .then((res) => {
                // Save intermediate cancellable
                this.setState({
                    removeFoodAwaitingResponse: false,
                    cancellablePromise: makeCancellableVal(res)
                });

                //== Self-unmounting calls ==//
                if (res.status === 401) {
                    console.log('@IngredientBox: Logging out.');
                    this.props.logout();
                }
                else if (res.ok) {
                    // Successful deletion
                    this.props.reload(this.props.ingredientID);
                }

                return this.state.cancellablePromise;
            })
            .then(res => {
                //== State-setting calls ==//
                this.setState({ removeFoodError: true });
            })
            .then(() => console.log('@IngredientBox: Removed food.'))
            .catch(err => console.log('@IngredientBox: Component unmounted.'));
        
        return cancellable;
    }

    handleClick = (event) => {
        this.setState({
            removeFoodAwaitingResponse: true,
            removeFoodError: false,
            cancellablePromise: this.getCancellableFetch()
        });
    }

    render() {
        const boxStyle = {
            height: 80,
            width: 80,
            textAlign: 'center',
            flex: '0 1 auto',
            overflow: 'hidden',
            paddingLeft: 5,
            paddingRight: 5,
            margin: 2,
        };

        const removeButtonStyle = {
            height: 10,
            width: 10,
        };

        return (
            <div>
                <Paper style={boxStyle} zDepth={3} >
                    {this.props.ingredientName}
                    <br />
                    <IconButton
                        style={removeButtonStyle} 
                        tooltip="Remove"
                        onClick={this.handleClick}
                        disabled={this.state.removeFoodAwaitingResponse}
                    >
                        <CloseIcon />
                    </IconButton>
                </Paper>
                
                <ApiErrorSnackbar
                    open={this.state.removeFoodError}
                    message={'Error removing food from cupboard'}
                />
            </div>
        );
    }
}

export default IngredientBox;
