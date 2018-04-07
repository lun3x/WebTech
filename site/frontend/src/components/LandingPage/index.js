import React, { Component } from 'react';
import fetch from 'cross-fetch';
import CupboardPage from '../CupboardPage';
import LoginForm from '../LoginForm';

class LandingPage extends Component {
    constructor(props) {
        super(props);
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
                this.setState({ authenticated: json.data.authenticated });
            })
            .catch((err) => {
                this.setState({ authenticationLoadingError: true });
            });
    }

    render() {
        return (
            {
                this.state.authenticationLoadingError
                ? <p> Error loading.</p>
                : this.state.authenticationIsLoading
                ? <p> Still loading.</p>
                : this.state.authenticated
                ? <CupboardPage />
                : <LoginForm />
            }
        );
    }
}

export default LandingPage;
