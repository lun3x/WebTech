import React, { Component } from 'react';
import { Paper } from 'material-ui';
import fetch from 'cross-fetch';
import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/CircularProgress';
import FindRecipesButton from '../FindRecipesButton';
import IngredientList from '../IngredientsList';
import ApiErrorSnackbar from '../ApiErrorSnackbar';
import NavBar from '../NavBar';
import makeCancellable from '../../promiseWrapper';
import makeCancellableVal from '../../valueWrapper';

class CupboardPage extends Component {

    static propTypes = {
        gotoFindRecipesPage: PropTypes.func.isRequired,
        setUserIngredientIds: PropTypes.func.isRequired,
        allIngredients:  PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string
        })).isRequired,
        logout: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            // fetch ingredients in user's cupboard
            userIngredients: [],
            userIngredientsAreLoading: false,
            userIngredientsLoadingError: false,

            cancellablePromise: undefined
        };
    }

    componentWillMount = () => {
        this.triggerCupboardReload();
    }

    componentWillUnmount = () => {
        if (this.state.cancellablePromise) this.state.cancellablePromise.cancel();
    }

    getCancellableFetch = () => {
        let cancellable = makeCancellable(fetch(`/api/cupboard/ingredients`, {
            method: 'GET',
            credentials: 'same-origin'
        }));

        cancellable
            .then(res => {
                this.setState({
                    userIngredientsAreLoading: false,
                    cancellablePromise: makeCancellableVal(res)
                });
                
                if (res.status === 401) {
                    console.log('@CupboardPage: logging out');
                    this.props.logout();
                }

                return this.state.cancellablePromise;
            })
            .then(res => {
                this.setState({
                    cancellablePromise: makeCancellable(res.json())
                });

                if (!res.ok) {
                    this.setState({ userIngredientsLoadingError: true });
                }

                return this.state.cancellablePromise;
            })
            .then(json => {
                this.props.setUserIngredientIds(json.data.cupboard.food.map((x) => x.ingredient_id));

                this.setState({
                    userIngredients: json.data.cupboard.food,
                    cancellablePromise: undefined
                });
            })
            .then(() => {
                console.log('@CupboardPage: Got cupboard ingredients.');
            })
            .catch((err) => console.log('@CupboardPage: Component unmounted.'));
        
        return cancellable;
    }

    triggerCupboardReload = () => {
        this.setState({
            userIngredientsAreLoading: true,
            userIngredientsLoadingError: false,
            cancellablePromise: this.getCancellableFetch()
        });
    };

    render() {
        const styles = {
            top: {
                height: '100%',
                padding: '1em',
            },
        };


        return (
            <div style={styles.top} >
                {
                    /* eslint-disable indent */
                    this.state.userIngredientsLoadingError
                    ? <p>Error loading.</p>
                    : this.state.userIngredientsAreLoading
                    ? <CircularProgress />
                    : <IngredientList
                        userIngredients={this.state.userIngredients}
                        allIngredients={this.props.allIngredients}
                        reload={this.triggerCupboardReload}
                        logout={this.props.logout}
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
