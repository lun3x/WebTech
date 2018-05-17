import React, { Component } from 'react';
import { Paper } from 'material-ui';
import fetch from 'cross-fetch';
import PropTypes from 'prop-types';
import FindRecipesButton from '../FindRecipesButton';
import IngredientList from '../IngredientsList';
import ApiErrorSnackbar from '../ApiErrorSnackbar';
import NavBar from '../NavBar';
import makeCancellable from '../../promiseWrapper';

class CupboardPage extends Component {

    static propTypes = {
        gotoFindRecipesPage: PropTypes.func.isRequired,
        setUserIngredientIds: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
        allIngredients:  PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string
        })).isRequired,
        logout: PropTypes.func.isRequired // eslint-disable-line react/no-unused-prop-types
    }

    constructor(props) {
        super(props);
        this.state = {
            // fetch ingredients in user's cupboard
            userIngredients: [],
            userIngredientsAreLoading: false,
            userIngredientsLoadingError: false,

            cancellableFetch: undefined
        };
    }

    componentWillMount = () => {
        this.triggerCupboardReload();
    }

    componentWillUnmount = () => {
        if (this.state.cancellableFetch) this.state.cancellableFetch.cancel();
    }

    getCancellableFetch = () => {
        let cancellable = makeCancellable(fetch(`/api/cupboard/ingredients`, {
            method: 'GET',
            credentials: 'same-origin'
        }));

        cancellable.promise
            .then(res => {
                this.setState({ userIngredientsAreLoading: false });
                if (res.status === 401) {
                    console.log('@CupboardPage: logging out');
                    this.props.logout();
                }
                return res;
            })
            .then(res => {
                if (!res.ok) {
                    this.setState({ userIngredientsLoadingError: true });
                }
                return res.json();
            })
            .then(json => {
                this.setState({ userIngredients: json.data.cupboard.food });
                this.props.setUserIngredientIds(json.data.cupboard.food.map((x) => x.ingredient_id));
            })
            .then(() => {
                console.log('@CupboardPage: Got cupboard ingredients.');
                this.setState({ cancellableFetch: undefined });
            })
            .catch((err) => console.log('@CupboardPage: Component unmounted.'));
        
        return cancellable;
    }

    triggerCupboardReload = () => {
        this.setState({
            userIngredientsAreLoading: true,
            userIngredientsLoadingError: false,
            cancellableFetch: this.getCancellableFetch()
        });
    };

    render() {
        return (
            <React.Fragment>
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
            </React.Fragment>
        );
    }
}

export default CupboardPage;
