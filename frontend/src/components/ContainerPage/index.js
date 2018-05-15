import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';

import NavBar from '../NavBar';
import CupboardPage from '../CupboardPage';
import SettingsPage from '../SettingsPage';
import RecipesPage from '../RecipesPage';
import SuggestPage from '../SuggestPage';

import ApiErrorSnackbar from '../ApiErrorSnackbar';

import makeCancellable from '../../promiseWrapper';

class ContainerPage extends Component {

    static propTypes = {
        logout: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            selectedPage: 0, // default is CupboardPage
            ingredientIds: undefined,
            
            // fetch all ingredients
            allIngredients: [],
            allIngredientsAreLoading: false,
            allIngredientsLoadingError: false,

            cancellableFetch: this.getCancellableFetch
        };
    }

    componentWillMount = () => {
        this.setState({ allIngredientsAreLoading: true });

        // fetch all ingredients
        this.fetchAllIngredients();
    }

    componentWillUnmount = () => {
        this.state.cancellableFetch.cancel();
    }

    getCancellableFetch = 
        makeCancellable(fetch('/api/ingredients')
            .then(res => {
                this.setState({ allIngredientsAreLoading: false });
                if (!res.ok) {
                    throw new Error('Failed to load all ingredients.');
                }
                return res.json();
            })
            .then(json => {
                this.setState({ allIngredients: json.data.ingredients });
            })
            .catch(err => {
                this.setState({ allIngredientsLoadingError: true });
            }));

    setIngredientIds = (ids) => this.setState({ ingredientIds: ids });

    selectPage = (ix) => this.setState({ selectedPage: ix });

    fetchAllIngredients = () => {
        this.state.cancellableFetch.promise
            .then(() => console.log('Got all ingredients.'))
            .catch((err) => console.log('Component unmounted: ', err));
    }

    render() {
        let page = null;
        switch (this.state.selectedPage) {
        case 0:
            page = (
                <CupboardPage
                    allIngredients={this.state.allIngredients}
                    gotoFindRecipesPage={() => this.selectPage(2)}
                    setUserIngredientIds={this.setIngredientIds}
                    logout={this.props.logout}
                />
            );
            break;
        case 1:
            page = (
                <SettingsPage logout={this.props.logout} />
            );
            break;
        case 2:
            page = (
                <RecipesPage goBack={() => this.selectPage(0)} ingredientIds={this.state.ingredientIds} />
            );
            break;
        case 3:
            page = (
                <SuggestPage
                    allIngredients={this.state.allIngredients}
                    goBack={() => this.selectPage(0)}
                />
            );
            break;
        default:
            page = (
                <CupboardPage
                    allIngredients={this.state.allIngredients}
                    gotoFindRecipesPage={() => this.selectPage(2)}
                    setUserIngredientIds={this.setIngredientIds}
                    logout={this.props.logout}
                />
            );
            break;
        }

        const pageStyle = {
            width: '100%',
            height: '100%',
            minHeight: '200',
        };

        return (
            <div style={pageStyle} >
                { page }

                <NavBar selectPageHandler={this.selectPage} />

                <ApiErrorSnackbar
                    open={this.state.allIngredientsAreLoading}
                    message={'Loading all ingredients'}
                />
                <ApiErrorSnackbar
                    open={this.state.allIngredientsLoadingError}
                    message={'Error loading list of all ingredients'}
                />
            </div>
        );
    }
}

export default ContainerPage;
