import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import IngredientBox from '../IngredientBox';
import AddIngredientDialog from '../AddIngredientDialog';
import makeCancellable from '../../promiseWrapper';
import makeCancellableVal from '../../valueWrapper';

class IngredientList extends Component {

    static defaultProps = {
        userIngredients: [],
        allIngredients: []
    };

    static propTypes = {
        userIngredients: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            ingredient_id: PropTypes.number
        })),
        allIngredients:  PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string
        })),
        reload: PropTypes.func.isRequired,
        logout: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            addFoodAwaitingResponse: false,
            addFoodSuccess: false,
            addFoodFail: false,

            cancellablePromise: undefined
        };
    }

    componentWillUnmount = () => {
        if (this.state.cancellablePromise) this.state.cancellablePromise.cancel();
    }

    getCancellableFetch = (ingredientId) => {
        let cancellable = makeCancellable(fetch(`/api/cupboard/add/${ingredientId}`, {
            method: 'PUT',
            credentials: 'same-origin'
        }));
        
        cancellable
            .then(res => {
                this.setState({
                    addFoodAwaitingResponse: false,
                    cancellablePromise: makeCancellableVal(res)
                });

                //== Self-unmounting calls ==//
                if (res.status === 401) {
                    console.log('@IngredientsList: logging out');
                    this.props.logout();
                }
                else if (res.ok) {
                    // Successful change
                    // OK to set state here as previous if will have to be false
                    this.setState({ addFoodSuccess: true });
                    this.resetLoadState();
                }

                return this.state.cancellablePromise;
            })
            .then(res => {
                if (!res.ok) {
                    this.setState({ addFoodFail: true });
                }

                this.setState({ cancellablePromise: undefined });
            })
            .catch((err) => console.log('Component unmounted.'));

        return cancellable;
    }

    resetLoadState = () => {
        this.setState({
            addFoodAwaitingResponse: false,
            addFoodSuccess: false,
            addFoodFail: false
        });
        this.props.reload();
    }

    handleAddFood = (chosenRequest, index) => {
        this.setState({
            addFoodFail: false,
            addFoodSuccess: false
        });

        if (index === -1) {
            // just ignore unless an item in list menu is selected
        }
        else {
            // make an api call to add the selected ingredient to the current cupboard
            let ingredientId = this.props.allIngredients[index].id;
            this.setState({
                addFoodAwaitingResponse: true,
                cancellablePromise: this.getCancellableFetch(ingredientId)
            });
        }
    }

    render() {
        // create IngredientBox for each user ingredient
        let i = -1;
        const ingredientList = this.props.userIngredients.map((x) => {
            i++;
            return (
                <IngredientBox
                    key={i}
                    ingredientName={x.name}
                    reload={this.resetLoadState}
                    ingredientID={x.ingredient_id}
                    cupboardIngredientID={x.id}
                    logout={this.props.logout}
                />
            );
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
            justifyContent: 'center',
        };

        return (
            <div style={outerStyle} >
                { ingredientList }
            </div>
        );
    }
}

export default IngredientList;
