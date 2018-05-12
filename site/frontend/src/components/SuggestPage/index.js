import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import IngredientBox from '../IngredientBox';
import AddIngredientDialog from '../AddIngredientDialog';
import ApiErrorSnackbar from '../ApiErrorSnackbar';

class SuggestPage extends Component {

    static defaultProps = {
        allIngredients: []
    };

    static propTypes = {
        allIngredients:  PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string
        })),
    };

    constructor(props) {
        super(props);
        this.state = {
            recipeIngredients: [],
        };
    }

    deleteIngredient(id) {
        this.setState({ recipeIngredients: this.state.recipeIngredients.filter(i => i.id !== id) }); 
    }

    addIngredient(id) {
        this.setState({ recipeIngredients: this.state.recipeIngredients.filter(i => i.id !== id) }); 
    }

    render() {
        // create IngredientBox for each recipe ingredient
        let i = -1;
        const ingredientList = this.state.recipeIngredients.map((x) => {
            i++;
            return <IngredientBox key={i} ingredientName={x.name} reload={this.deleteIngredient(x.id)} ingredientID={x.id} />;
        });

        // add a IngredientPlusBox at the end
        i++;
        ingredientList.push(
            <AddIngredientDialog
                key={i}
                ingredients={this.props.allIngredients}
                triggerCupboardReload={null}
            />
        );

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

export default SuggestPage;
