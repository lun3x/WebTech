import React, { Component } from 'react';
import { RaisedButton } from 'material-ui';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import IngredientBox from '../IngredientBox';
import AddIngredientDialog from '../AddIngredientDialog';
import ApiErrorSnackbar from '../ApiErrorSnackbar';
import makeCancellable from '../../promiseWrapper';
import makeCancellableVal from '../../valueWrapper';

class SuggestPage extends Component {

    static defaultProps = {
        allIngredients: []
    };

    static propTypes = {
        allIngredients:  PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string
        })),
        logout: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            addFoodAwaitingResponse: false,
            addFoodSuccess: false,
            addFoodFail: false,
            createRecipeAwaitingResponse: false,
            createRecipeSuccess: false,
            createRecipeFail: false,
            recipeIngredients: [],
            name: '',
            method: '',

            cancellablePromise: undefined
        };
    }

    componentWillUnmount = () => {
        if (this.state.cancellablePromise) this.state.cancellablePromise.cancel();
    }

    getCancellableFetch = () => {
        let cancellable = makeCancellable(fetch('/api/recipes/create', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                recipe: {
                    name: this.state.name,
                    method: this.state.method,
                    ingredient_ids: this.state.recipeIngredients.map(i => i.id)
                }
            })
        }));
        
        cancellable
            .then((res) => {
                this.setState({
                    createRecipeAwaitingResponse: false,
                    cancellablePromise: makeCancellableVal(res)
                });

                if (res.status === 401) {
                    console.log('@SuggestPage: Logging out!');
                    this.props.logout();
                }
                else if (!res.ok) {
                    this.setState({ createRecipeFail: true });
                }
                else {
                    this.clearRecipe();
                    this.setState({ createRecipeSuccess: true });
                }

                return this.state.cancellablePromise;
            })
            .then(res => {
                console.log('@SuggestPage: Created new recipe.');
                this.setState({ cancellablePromise: undefined });
            })
            .catch(err => console.log('@SuggestPage: Component unmounted.'));

        return cancellable;
    }

    handleChange = (event) => {
        const target = event.target;

        this.setState({
            [target.name]: target.value
        });
    }

    deleteIngredientFromRecipe = (id) => {
        this.setState({ recipeIngredients: this.state.recipeIngredients.filter(e => e.id !== id) });
    }

    handleAddFood = (chosenRequest, index) => {
        this.setState({
            addFoodAwaitingResponse: true,
            addFoodFail: false,
            addFoodSuccess: false
        });

        if (index === -1) {
            // just ignore unless an item in list menu is selected
        }
        else {
            // make an api call to add the selected ingredient to the current cupboard
            let ingredient = this.props.allIngredients[index];
            this.reloadList();
            this.setState({ recipeIngredients: this.state.recipeIngredients.concat([ingredient]) });
        }
    }

    reloadList = () => {
        this.setState({
            addFoodAwaitingResponse: false,
            addFoodSuccess: false,
            addFoodFail: false
        });
    }

    clearRecipe = () => {
        this.setState({
            name: '',
            method: '',
            recipeIngredients: []
        });
    }

    createRecipe = () => {
        this.setState({
            createRecipeAwaitingResponse: true,
            createRecipeFail: false,
            createRecipeSuccess: false,
            cancellablePromise: this.getCancellableFetch()
        });
    }

    render() {
        // create IngredientBox for each user ingredient
        let i = -1;
        const ingredientList = this.state.recipeIngredients.map((x) => {
            i++;
            return (
                <IngredientBox
                    key={i}
                    ingredientName={x.name}
                    reload={this.deleteIngredientFromRecipe}
                    ingredientID={x.id}
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
                triggerCupboardReload={this.reloadList}
            />
        );

        const outerStyle = {
            display: 'flex',
            flexFlow: 'row wrap',
        };

        const buttonStyle = {
            marginTop: 20,
        };

        return (
            <div style={{ padding: '1em' }}>
                <div style={outerStyle} >
                    { ingredientList }
                </div>
                <div>
                    <TextField
                        name="name"
                        hintText="Enter recipe name"
                        floatingLabelText="Recipe Name"
                        value={this.state.name}
                        onChange={this.handleChange}
                    />
                    <br />
                    <TextField
                        name="method"
                        hintText="Enter method"
                        floatingLabelText="Method"
                        multiLine
                        value={this.state.method}
                        onChange={this.handleChange}
                    />
                    <br />
                    <RaisedButton
                        style={buttonStyle}
                        label="Create Recipe"
                        secondary
                        onClick={this.createRecipe}
                    />
                    <br />
                    {
                        this.state.createRecipeAwaitingResponse ?
                            <CircularProgress />
                            :
                            null
                    }

                    <ApiErrorSnackbar
                        open={this.state.createRecipeFail}
                        message="Error creating new recipe!"
                    />

                    <ApiErrorSnackbar
                        open={this.state.createRecipeSuccess}
                        message="Success creating new recipe!"
                    />
                </div>
            </div>
        );
    }
}

export default SuggestPage;
