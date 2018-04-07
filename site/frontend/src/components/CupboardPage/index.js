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
            ingredients: undefined,
            ingredientsAreLoading: false,
            ingredientsLoadingError: false,
        };
    }

    componentWillMount() {
        this.setState({ ingredientsAreLoading: true });

        let userId = 1;
        fetch(`/api/cupboards/user/${userId}`)
            .then((res) => {
                this.setState({ ingredientsAreLoading: false });
                if (res.status !== 200) {
                    throw new Error('Bad status from server');
                }
                return res.json();
            })
            .then((json) => {
                this.setState({ ingredients: json.data.cupboard.food });
            })
            .catch((err) => {
                this.setState({ ingredientsLoadingError: true });
            });
    }

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
                    this.state.ingredientsLoadingError
                    ? <p>Error loading.</p>
                    : this.state.ingredientsAreLoading
                    ? <p>Still loading.</p>
                    : <IngredientList ingredients={this.state.ingredients} />
                    /* eslint-enable indent */
                }

                <FindRecipesButton />

                <ApiErrorSnackbar open={this.state.ingredientsLoadingError} />
            </Paper>
        );
    }
}

export default CupboardPage;
