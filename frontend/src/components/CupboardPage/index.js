import React, { Component } from 'react';
import { Paper } from 'material-ui';
import fetch from 'cross-fetch';
import PropTypes from 'prop-types';
import FindRecipesButton from '../FindRecipesButton';
import IngredientList from '../IngredientsList';
import ApiErrorSnackbar from '../ApiErrorSnackbar';
import NavBar from '../NavBar';

class CupboardPage extends Component {

    static propTypes = {
        gotoFindRecipesPage: PropTypes.func.isRequired,
        setUserIngredientIds: PropTypes.func.isRequired,
        allIngredients:  PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string
        })).isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            // fetch ingredients in user's cupboard
            userIngredients: [],
            userIngredientsAreLoading: false,
            userIngredientsLoadingError: false,
        };
    }

    componentWillMount() {
        this.setState({ userIngredientsAreLoading: true });

        // fetch the user's cupboard
        this.fetchUserCupboard();
    }

    fetchUserCupboard = () => {
        fetch(`/api/cupboard/ingredients`, {
            method: 'GET',
            credentials: 'same-origin'
        }).then(res => {
            this.setState({ userIngredientsAreLoading: false });
            if (res.status !== 200) {
                throw new Error('Bad status from server');
            }
            return res.json();
        }).then(json => {
            this.setState({ userIngredients: json.data.cupboard.food });
            this.props.setUserIngredientIds(json.data.cupboard.food.map((x) => x.ingredient_id));
        }).catch(err => {
            this.setState({ userIngredientsLoadingError: true });
        });
    }

    triggerCupboardReload = () => {
        this.fetchUserCupboard();
    };

    render() {
        return (
            <div>
                {
                    /* eslint-disable indent */
                    this.state.userIngredientsLoadingError
                    ? <p>Error loading.</p>
                    : this.state.userIngredientsAreLoading
                    ? <p>Still loading.</p>
                    : <IngredientList
                        userIngredients={this.state.userIngredients}
                        allIngredients={this.props.allIngredients}
                        reload={this.triggerCupboardReload}
                    />
                    /* eslint-enable indent */
                }

                <FindRecipesButton
                    disabled={this.state.userIngredients.length === 0}
                    gotoFindRecipesPage={this.props.gotoFindRecipesPage}
                />

                { /*<NavBar handleAuthChange={this.props.handleAuthChange} /> */ }

                <ApiErrorSnackbar
                    open={this.state.userIngredientsLoadingError}
                    message={'Error loading ingredients in your cupboard'}
                />
            </div>
        );
    }
}

export default CupboardPage;
