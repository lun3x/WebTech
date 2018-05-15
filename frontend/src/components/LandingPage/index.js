import React, { Component } from 'react';
import { Paper } from 'material-ui';
import fetch from 'cross-fetch';
import ContainerPage from '../ContainerPage';
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

        fetch(`/auth/isAuthenticated`, { method: 'GET', credentials: 'same-origin' })
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

    logout = () => {
        this.setState({ authenticationIsLoading: true });

        fetch('/auth/logout', { method: 'GET' })
            .then(res => {
                this.setState({ authenticationIsLoading: false });
                if (res.status !== 200) {
                    throw new Error('Failed to logout');
                }
                this.setState({ authenticated: false });
            })
            .catch((err) => {
                this.setState({ authenticationLoadingError: true });
            });
    }

    render() {
        const style = {
            height: '100%',
            width: '65%',
            textAlign: 'centre',
            padding: 10,
            margin: 'auto'
        };

        return (
            <Paper style={style} zDepth={2} rounded={false} >
                {
                    /* eslint-disable indent */
                    this.state.authenticationLoadingError
                    ? <p> Error loading.</p>
                    : this.state.authenticationIsLoading
                    ? <p> Still loading.</p>
                    : this.state.authenticated
                    //? <CupboardPage handleAuthChange={this.handleAuthChange} />
                    ? <ContainerPage logout={this.logout} />
                    : <LoginForm onAuthChange={this.handleAuthChange} />
                    /* eslint-enable indent */
                }

                <ApiErrorSnackbar open={this.state.authenticationLoadingError} />
            </Paper>
        );
    }
}

export default LandingPage;
