import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import CloseIcon from 'material-ui/svg-icons/navigation/cancel';
import IconButton from 'material-ui/IconButton';
import PropTypes from 'prop-types';
import ApiErrorSnackbar from '../ApiErrorSnackbar';
import makeCancellable from '../../promiseWrapper';
import makeCancellableVal from '../../valueWrapper';
import style from './style.css';

import tomato from './ingredients/tomato.svg';
import cheese from './ingredients/cheese.svg';
import potato from './ingredients/potato.svg';
import onion from './ingredients/onion.svg';
import pepper from './ingredients/pepper.svg';
import flour from './ingredients/flour.svg';
import chocolate from './ingredients/chocolate.svg';
import kidneybeans from './ingredients/kidneybeans.svg';
import tuna from './ingredients/tuna.svg';
import pasta from './ingredients/pasta.svg';
import steak from './ingredients/steak.svg';
import chicken from './ingredients/chicken.svg';
import lemon from './ingredients/lemon.svg';
import lime from './ingredients/lime.svg';
import milk from './ingredients/milk.svg';
import banana from './ingredients/banana.svg';

class IngredientBox extends Component {

    static propTypes = {
        ingredientName: PropTypes.string.isRequired,
        ingredientID: PropTypes.number.isRequired,
        reload: PropTypes.func.isRequired,
        logout: PropTypes.func.isRequired,
        cupboardIngredientID: PropTypes.number.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            removeFoodAwaitingResponse: false,
            removeFoodError: false,
            mouseHover: false,
            cancellablePromise: undefined,
            images: [ tomato, cheese, potato, onion, pepper, flour, chocolate, kidneybeans, tuna, pasta, steak, chicken, lemon, lime, milk, banana ]
        };
    }

    componentWillMount = () => {
        console.dir(this.props.ingredientID);
        console.dir(this.props.cupboardIngredientID);
        console.dir(this.props.ingredientName);
        console.dir(this.state.images);
    }

    componentWillUnmount = () => {
        if (this.state.cancellablePromise) this.state.cancellablePromise.cancel();
    }
    
    onMouseEnter = () => {
        this.setState({ mouseHover: true });
    }

    onMouseLeave = () => {
        this.setState({ mouseHover: false });
    }

    getCancellableFetch = () => {
        let cancellable = makeCancellable(fetch(`/api/cupboard/remove/${this.props.cupboardIngredientID}`, {
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
                    this.props.reload(this.props.cupboardIngredientID);
                }

                return this.state.cancellablePromise;
            })
            .then(res => {
                //== State-setting calls ==//
                this.setState({ removeFoodError: true, cancellablePromise: undefined });
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

        const paperStyle = {
            borderRadius: '10px', // we have to override material-ui inline
        };

        const iconStyle = {
            position: 'absolute', // we have to override material-ui inline
        };

        let iconButton = null;

        if (this.state.mouseHover) {
            iconButton = (
                <IconButton
                    className={style.remove_button}
                    tooltip="Remove"
                    onClick={this.handleClick}
                    disabled={this.state.removeFoodAwaitingResponse}
                    style={iconStyle}
                    tooltipPosition="bottom-right"
                    touch
                >
                    <CloseIcon />
                </IconButton>
            );
        }

        return (
            <div>
                <Paper
                    className={style.ingredient_box}
                    style={paperStyle}
                    zDepth={2}
                    rounded
                    onMouseEnter={this.onMouseEnter}
                    onMouseLeave={this.onMouseLeave}
                >
                    { iconButton }
                    <br />
                    {this.props.ingredientName}
                    <br />
                    <img src={this.state.images[this.props.ingredientID - 1]} alt={this.props.ingredientName} className={style.ingredient_img} />
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
