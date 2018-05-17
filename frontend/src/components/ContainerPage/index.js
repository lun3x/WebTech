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

            cancellableFetch: undefined
        };
    }

    componentWillMount = () => {
        this.setState({
            allIngredientsAreLoading: true,
            cancellableFetch: this.getCancellableFetch()
        });
    }

    componentWillUnmount = () => {
        if (this.state.cancellableFetch) this.state.cancellableFetch.cancel();
    }

    getCancellableFetch = () => {
        let cancellable = makeCancellable(fetch('/api/ingredients', {
            method: 'GET'
        }));

        cancellable.promise
            .then(res => {
                //== State-setting calls ==//
                this.setState({ allIngredientsAreLoading: false });
                if (!res.ok) {
                    this.setState({ allIngredientsLoadingError: true });
                }
                else {
                    this.setState({ allIngredients: res.json().data.ingredients });
                }

                // Reset cancellable
                this.setState({ cancellableFetch: undefined });
            })
            .then(() => {
                //== Confirmation ==//
                console.log('@ContainerPage: Got all ingredients.');
            })
            .catch((err) => console.log('@ContainerPage: Component unmounted.'));

        return cancellable;
    }

    setIngredientIds = (ids) => this.setState({ ingredientIds: ids });

    selectPage = (ix) => this.setState({ selectedPage: ix });

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
                <SettingsPage
                    logout={this.props.logout}
                />
            );
            break;
        case 2:
            page = (
                <RecipesPage
                    goBack={() => this.selectPage(0)}
                    ingredientIds={this.state.ingredientIds}
                    logout={this.props.logout}
                />
            );
            break;
        case 3:
            page = (
                <SuggestPage
                    allIngredients={this.state.allIngredients}
                    goBack={() => this.selectPage(0)}
                    logout={this.props.logout}
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
