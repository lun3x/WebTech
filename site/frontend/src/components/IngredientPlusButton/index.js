import React, { Component } from 'react';
import fetch from 'cross-fetch';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import SvgIcon from 'material-ui/SvgIcon';
import { lightGreenA200, grey400 } from 'material-ui/styles/colors';

// TODO: make the button and onTouchTap we bring up a overlay with a dropdown menu.
class IngredientPlusButton extends Component {

    static defaultProps = {
        // allIngredients: []
    };

    static propTypes = {
        // allIngredients:  PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })),
        onClick: PropTypes.func.isRequired,
    };

    render() {
        const style = {
            paper: {
                height: 80,
                width: 80,
                textAlign: 'center',
                //flex: '0 1 auto',
                //overflow: 'hidden', <- hide to allow tooltip
                paddingLeft: 2,
                paddingRight: 2,
                margin: 2,
            },
            iconButton: {
                position: 'relative'
            },
            svgIcon: {
                position: 'absolute',
                top: '37%',
                transform: 'translateX(-50%)',
                height: '100%',
                width: '100%',
                overflow: 'hidden',
            }
        };

        const props = {
            iconButton: {
                touch: true,
                tooltip: 'Add an ingredient',
                tooltipPosition: 'bottom-right',
                onClick: this.props.onClick,
            },
            svgIcon: {
                color: grey400,
                hoverColor: lightGreenA200,
            },
        };

        return (
            <Paper style={style.paper} zDepth={3} >
                <IconButton 
                    {...props.iconButton}
                    style={style.iconButton}
                    iconStyle={style.svgIcon}
                >
                    <SvgIcon {...props.svgIcon} >
                        <path d={'M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z'} />
                    </SvgIcon>
                </IconButton>
            </Paper>
        );
    }

}

export default IngredientPlusButton;
