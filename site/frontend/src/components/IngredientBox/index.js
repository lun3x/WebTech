import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';

class IngredientBox extends Component {

    static propTypes = {
        ingredientName: PropTypes.string.isRequired,
    };

    render() {
        const style = {
            height: 80,
            width: 80,
            textAlign: 'center',
            flex: '0 1 auto',
            overflow: 'hidden',
            paddingLeft: 5,
            paddingRight: 5,
            margin: 2,
        };

        return (
            <Paper style={style} zDepth={3} >
                {this.props.ingredientName}
            </Paper>
        );
    }
}

export default IngredientBox;
