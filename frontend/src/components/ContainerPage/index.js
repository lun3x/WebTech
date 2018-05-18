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

            cancellablePromise: undefined
        };
    }

    componentWillMount = () => {
        this.setState({
            allIngredientsAreLoading: true,
            cancellablePromise: this.getCancellableFetch()
        });
    }

    componentWillUnmount = () => {
        if (this.state.cancellablePromise) this.state.cancellablePromise.cancel();
    }

    getCancellableFetch = () => {
        let cancellable = makeCancellable(fetch('/api/ingredients', {
            method: 'GET'
        }));

        cancellable
            .then(res => {
                // Save intermediate cancellable
                this.setState({
                    cancellablePromise: makeCancellable(res.json()),
                    allIngredientsAreLoading: false
                });

                //== State-setting calls ==//
                if (!res.ok) {
                    this.setState({ allIngredientsLoadingError: true });
                }

                return this.state.cancellablePromise;
            })
            .then((json) => {
                //== Intermediate data calls ==//

                // Set data and reset cancellable
                this.setState({
                    allIngredients: json.data.ingredients,
                    cancellablePromise: undefined
                });
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
                    gotoFindRecipesPage={() => this.selectPage(3)}
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
                <SuggestPage
                    allIngredients={this.state.allIngredients}
                    logout={this.props.logout}
                />
            );
            break;
        case 3:
            page = (
                <RecipesPage
                    goBack={() => this.selectPage(0)}
                    ingredientIds={this.state.ingredientIds}
                    logout={this.props.logout}
                />
            );
            break;
        default:
            page = (
                <CupboardPage
                    allIngredients={this.state.allIngredients}
                    gotoFindRecipesPage={() => this.selectPage(3)}
                    setUserIngredientIds={this.setIngredientIds}
                    logout={this.props.logout}
                />
            );
            break;
        }

        const pageStyle = {
            //width: '100%',
            height: '100%',
            minHeight: '200',
            position: 'relative',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
        };

        return (
            <div style={pageStyle} >

                <div style={{ overflow: 'auto' }} >{ page }</div>

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
