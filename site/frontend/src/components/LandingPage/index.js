import React, { Component } from 'react';
import { Paper } from 'material-ui';
import fetch from 'cross-fetch';
import CupboardPage from '../CupboardPage';
import LoginForm from '../LoginForm';
import ApiErrorSnackbar from '../ApiErrorSnackbar';

class LandingPage extends Component {
    constructor(props) {
        super(props);
        this.handleAuthChange = this.handleAuthChange.bind(this);
        this.state = {
            authenticated: false,
            authenticationIsLoading: false,
            authenticationLoadingError: false,
        };
    }

    componentWillMount() {
        this.setState({ authenticationIsLoading: true });

        let userId = 1;
        fetch(`/auth/isAuthenticated`)
            .then((res) => {
                this.setState({ authenticationIsLoading: false });
                if (res.status !== 200) {
                    throw new Error('Bad status from server');
                }
                return res.json();
            })
            .then((json) => {
                this.setState({ authenticated: json.authenticated });
            })
            .catch((err) => {
                this.setState({ authenticationLoadingError: true });
            });
    }

    handleAuthChange(auth) {
        this.setState({ authenticated: auth });
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
                    this.state.authenticationLoadingError
                    ? <p> Error loading.</p>
                    : this.state.authenticationIsLoading
                    ? <p> Still loading.</p>
                    : this.state.authenticated
                    ? <CupboardPage />
                    : <LoginForm onAuthChange={this.handleAuthChange} />
                    /* eslint-enable indent */
                }

                <ApiErrorSnackbar open={this.state.authenticationLoadingError} />
            </Paper>
        );
    }
}

export default LandingPage;
