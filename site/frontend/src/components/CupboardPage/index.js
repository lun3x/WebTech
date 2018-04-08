import React, { Component } from 'react';
import { Paper } from 'material-ui';
import fetch from 'cross-fetch';
import FindRecipesButton from '../FindRecipesButton';
import IngredientList from '../IngredientsList';
import ApiErrorSnackbar from '../ApiErrorSnackbar';

class CupboardPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // fetch ingredients in user's cupboard
            userIngredients: undefined,
            userIngredientsAreLoading: false,
            userIngredientsLoadingError: false,

            // fetch all ingredients
            allIngredients: undefined,
            allIngredientsAreLoading: false,
            allIngredientsLoadingError: false,
        };
    }

    componentWillMount() {
        this.setState({ userIngredientsAreLoading: true });

        // fetch the user's cupboard
        this.fetchUserCupboard();

        // fetch all ingredients
        this.fetchAllIngredients();
    }

    fetchAllIngredients = () => {
        // fetch a list of all ingredients
        fetch('/api/ingredients')
            .then(res => {
                this.setState({ allIngredientsAreLoading: false });
                if (res.status !== 200) {
                    throw new Error('Bad status from server');
                }
                return res.json();
            })
            .then(json => {
                this.setState({ allIngredients: json.data.ingredients });
            })
            .catch(err => {
                this.setState({ allIngredientsLoadingError: true });
            });
    }

    fetchUserCupboard = () => {
        let userId = 1;
        fetch(`/api/cupboards/user/${userId}`)
            .then(res => {
                this.setState({ userIngredientsAreLoading: false });
                if (res.status !== 200) {
                    throw new Error('Bad status from server');
                }
                return res.json();
            })
            .then(json => {
                this.setState({ userIngredients: json.data.cupboard.food });
            })
            .catch(err => {
                this.setState({ userIngredientsLoadingError: true });
            });
    }

    triggerCupboardReload = () => {
        this.fetchUserCupboard();
    };

    render() {
        const style = {
            height: 500,
            textAlign: 'centre',
            padding: 10,
        };

        return (
            <Paper style={style} zDepth={2} rounded={false}>
                <p>Hello, app.</p>

                {
                    /* eslint-disable indent */
                    this.state.userIngredientsLoadingError
                    ? <p>Error loading.</p>
                    : this.state.userIngredientsAreLoading
                    ? <p>Still loading.</p>
                    : <IngredientList 
                        userIngredients={this.state.userIngredients}
                        allIngredients={this.state.allIngredients}
                        reload={this.triggerCupboardReload}
                    />
                    /* eslint-enable indent */
                }

                <FindRecipesButton />

                <ApiErrorSnackbar
                    open={this.state.userIngredientsLoadingError}
                    message={'Error loading ingredients in your cupboard'}
                />

                <ApiErrorSnackbar
                    open={this.state.allIngredientsAreLoading}
                    message={'Loading all ingredients'}
                />
                <ApiErrorSnackbar
                    open={this.state.allIngredientsLoadingError}
                    message={'Error loading list of all ingredients'}
                />
    
            </Paper>
        );
    }
}

export default CupboardPage;
