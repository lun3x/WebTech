import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import IngredientBox from '../IngredientBox';
import AddIngredientDialog from '../AddIngredientDialog';

class IngredientList extends Component {

    static defaultProps = {
        userIngredients: [],
        allIngredients: []
    };

    static propTypes = {
        userIngredients: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })),
        allIngredients:  PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string
        })),
        reload: PropTypes.func.isRequired,
    };

    render() {
        // create IngredientBox for each user ingredient
        let i = -1;
        const ingredientList = this.props.userIngredients.map((x) => {
            i++;
            return <IngredientBox key={i} ingredientName={x.name} />;
        });

        // add a IngredientPlusBox at the end
        i++;
        console.dir(ingredientList);
        ingredientList.push(
            <AddIngredientDialog
                key={i}
                ingredients={this.props.allIngredients}
                triggerCupboardReload={this.props.reload}
            />
        );
        console.dir(ingredientList);

        const outerStyle = {
            display: 'flex',
            flexFlow: 'row wrap',
        };

        return (
            <div style={outerStyle} >
                { ingredientList }
            </div>
        );
    }
}

export default IngredientList;
