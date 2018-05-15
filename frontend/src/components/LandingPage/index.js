import React, { Component } from 'react';
import { Paper } from 'material-ui';
import fetch from 'cross-fetch';
import ContainerPage from '../ContainerPage';
import LoginForm from '../LoginForm';
import ApiErrorSnackbar from '../ApiErrorSnackbar';
import makeCancellable from '../../promiseWrapper';

class LandingPage extends Component {
    constructor(props) {
        super(props);
        this.handleAuthChange = this.handleAuthChange.bind(this);
        this.state = {
            authenticated: false,
            authenticationIsLoading: false,
            authenticationLoadingError: false,

            cancellableAuth: undefined,
            cancellableLogout: undefined
        };
    }

    componentWillMount() {
        this.setState({
            authenticationIsLoading: true,
            cancellableAuth: this.getCancellableAuth()
        });
    }

    componentWillUnmount = () => {
        if (this.state.cancellableLogout) this.state.cancellableLogout.cancel();
        if (this.state.cancellableAuth) this.state.cancellableAuth.cancel();
    }

    getCancellableAuth = () => {
        let cancellable = makeCancellable(fetch(`/auth/isAuthenticated`, {
            method: 'GET',
            credentials: 'same-origin'
        })
            .then((res) => {
                console.log('AUTHENTICATING');
                this.setState({ authenticationIsLoading: false });
                if (!res.ok) {
                    throw new Error('Bad status from server');
                }
                return res.json();
            })
            .then((json) => {
                this.setState({ authenticated: json.authenticated });
            })
            .catch((err) => {
                this.setState({ authenticationLoadingError: true });
            }));

        cancellable.promise
            .then(() => {
                console.log('Got authentication state.');
                this.setState({ cancellableAuth: undefined });
            })
            .catch((err) => console.log('Component unmounted: ', err));

        return cancellable;
    }

    getCancellableLogout = () => {
        let cancellable = makeCancellable(fetch('/auth/logout', {
            method: 'GET',
            credentials: 'same-origin'
        })
            .then(res => {
                console.log('LOGGING OUT');
                this.setState({ authenticationIsLoading: false });
                if (!res.ok) {
                    throw new Error('Failed to logout.');
                }
                this.setState({ authenticated: false });
            })
            .catch((err) => {
                this.setState({ authenticationLoadingError: true });
            }));
        
        cancellable.promise
            .then(() => {
                console.log('Logged user out.');
                this.setState({ cancellableLogout: undefined });
            })
            .catch((err) => console.log('Component unmounted: ', err));

        return cancellable;
    }
    
    handleAuthChange(auth) {
        this.setState({ authenticated: auth });
    }

    logout = () => {
        this.setState({
            authenticationIsLoading: true,
            cancellableLogout: this.getCancellableLogout()
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
