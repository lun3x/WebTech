import React, { Component } from 'react';
import { Paper } from 'material-ui';
import fetch from 'cross-fetch';
import ContainerPage from '../ContainerPage';
import LoginForm from '../LoginForm';
import ApiErrorSnackbar from '../ApiErrorSnackbar';
import makeCancellable from '../../promiseWrapper';
import makeCancellableVal from '../../valueWrapper';

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
        }));

        cancellable
            .then((res) => {
                //== State-setting calls ==//
                this.setState({ authenticationIsLoading: false });

                if (!res.ok) {
                    this.setState({ authenticationLoadingError: true });
                }
                else {
                    this.setState({ authenticated: res.json().authenticated });
                }

                // Reset cancellable
                this.setState({ cancellableAuth: undefined });
            })
            .then(() => {
                //== Confirmation ==//
                console.log('@LandingPage: Got authentication state.');
            })
            .catch((err) => console.log('@LandingPage: Component unmounted.'));

        return cancellable;
    }

    getCancellableLogout = () => {
        let cancellable = makeCancellable(fetch('/auth/logout', {
            method: 'GET',
            credentials: 'same-origin'
        }));

        cancellable
            .then(res => {
                //== State-setting calls ==//
                this.setState({ authenticationIsLoading: false });

                if (!res.ok) {
                    this.setState({ authenticationLoadingError: true });
                }
                else {
                    this.setState({ authenticated: false });
                }

                // Reset cancellable
                this.setState({ cancellableLogout: undefined });
            })
            .then(() => {
                //== Confirmation ==//
                console.log('@LandingPage: Logged user out.');
            })
            .catch((err) => console.log('@LandingPage: Component unmounted.'));

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
            <React.Fragment>
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
                </Paper>
                <ApiErrorSnackbar open={this.state.authenticationLoadingError} />
            </React.Fragment>
        );
    }
}

export default LandingPage;
