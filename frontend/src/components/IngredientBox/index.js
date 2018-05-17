import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import CloseIcon from 'material-ui/svg-icons/navigation/cancel';
import IconButton from 'material-ui/IconButton';
import PropTypes from 'prop-types';
import ApiErrorSnackbar from '../ApiErrorSnackbar';
import style from './style.css';
import carrotsPng from './carrots.png';

class IngredientBox extends Component {

    static propTypes = {
        ingredientName: PropTypes.string.isRequired,
        ingredientID: PropTypes.number.isRequired,
        reload: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            removeFoodAwaitingResponse: false,
            removeFoodError: false,
            mouseHover: false,
        };

        this.handleClick = this.handleClick.bind(this);
    }

    onMouseEnter = () => {
        this.setState({ mouseHover: true });
    }

    onMouseLeave = () => {
        this.setState({ mouseHover: false });
    }

    handleClick = (event) => {
        this.setState({ removeFoodAwaitingResponse: true });

        fetch(`/api/cupboard/remove/${this.props.ingredientID}`, {
            method: 'DELETE',
            credentials: 'same-origin',
        }).then((res) => {
            this.setState({ removeFoodAwaitingResponse: false });
            this.props.reload(this.props.ingredientID);
            if (res.status !== 200) {
                this.setState({ removeFoodError: true });
            }
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
                    <img src={carrotsPng} alt={this.props.ingredientName} className={style.ingredient_img} />
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
