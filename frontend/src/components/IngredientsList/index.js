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
        userIngredients: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string
        })),
        allIngredients:  PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string
        })),
        reload: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            addFoodAwaitingResponse: false,
            addFoodSuccess: false,
            addFoodFail: false,
        };
    }

    resetLoadState = () => {
        this.setState({ addFoodAwaitingResponse: false, addFoodSuccess: false, addFoodFail: false });
        this.props.reload();
    }

    handleAddFood = (chosenRequest, index) => {
        this.setState({ addFoodAwaitingResponse: true, addFoodFail: false, addFoodSuccess: false });

        if (index === -1) {
            // just ignore unless an item in list menu is selected
        }
        else {
            // make an api call to add the selected ingredient to the current cupboard
            let ingredientId = this.props.allIngredients[index].id;
            fetch(`/api/cupboard/add/${ingredientId}`, {
                method: 'PUT',
                credentials: 'same-origin'
            }).then(res => {
                this.setState({ addFoodAwaitingResponse: false });

                if (res.status === 201) {
                    this.setState({ addFoodSuccess: true });
                    this.resetLoadState();
                }
                else {
                    this.setState({ addFoodFail: true });
                }
            });
        }
    }

    render() {
        // create IngredientBox for each user ingredient
        let i = -1;
        const ingredientList = this.props.userIngredients.map((x) => {
            i++;
            return <IngredientBox key={i} ingredientName={x.name} reload={this.resetLoadState} ingredientID={x.id} />;
        });

        // add a IngredientPlusBox at the end
        i++;
        ingredientList.push(
            <AddIngredientDialog
                addFoodAwaitingResponse={this.state.addFoodAwaitingResponse}
                addFoodFail={this.state.addFoodFail}
                addFoodSuccess={this.state.addFoodSuccess}
                handleAddFood={this.handleAddFood}
                key={i}
                ingredients={this.props.allIngredients}
                triggerCupboardReload={this.resetLoadState}
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

export default IngredientList;
