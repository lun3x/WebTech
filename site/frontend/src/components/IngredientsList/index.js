import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import IngredientBox from '../IngredientBox';

class IngredientList extends Component {

    static defaultProps = {
        ingredients: []
    };

    static propTypes = {
        ingredients: PropTypes.arrayOf(PropTypes.string),
    };

    render() {
        let i = 0;
        const ingredientList = this.props.ingredients.map((x) => {
            i++;
            return <IngredientBox key={i} ingredientName={x} />;
        });

        const outerStyles = {
            display: 'flex',
            flexFlow: 'row wrap',
        };

        return (
            <div style={outerStyles} >
                { ingredientList }
            </div>
        );
    }
}

export default IngredientList;
