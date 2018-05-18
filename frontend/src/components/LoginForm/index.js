import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import AppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';
import { Paper } from 'material-ui';
import fetch from 'cross-fetch';
import PropTypes from 'prop-types';
import FindRecipesButton from '../FindRecipesButton';
import IngredientList from '../IngredientsList';
import ApiErrorSnackbar from '../ApiErrorSnackbar';
import RegisterForm from '../RegisterForm';
import makeCancellable from '../../promiseWrapper';
import makeCancellableVal from '../../valueWrapper';
import logo from './logo.svg';

class LoginForm extends Component {
    static propTypes = {
        onAuthChange: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            loginLoading: false,
            loginError: false,
            loginFailed: false,
            registration: false,

            cancellablePromise: undefined
        };
    }

    componentWillUnmount = () => {
        if (this.state.cancellablePromise) this.state.cancellablePromise.cancel();
    }

    getCancellableFetch = () => {
        let cancellable = makeCancellable(fetch(`/auth/login`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        }));
        
        cancellable
            .then(res => {
                // Save intermediate cancellable
                this.setState({
                    cancellablePromise: makeCancellableVal(res),
                    loginLoading: false
                });

                //== Self-unmounting calls ==//
                if (res.ok) {
                    this.props.onAuthChange(true);
                }
                else if (res.status === 401) {
                    // OK to set state here as previous if must be false
                    this.setState({ loginFailed: true });
                }
                else {
                    // OK to set state here as previous if must be false
                    this.setState({ loginError: true });
                }

                return this.state.cancellablePromise;
            })
            .then(res => {
                //== State-setting calls ==//
                this.setState({ cancellablePromise: undefined });
            })
            .then(() => console.log('@LoginForm: Logged in.'))
            .catch((err) => console.log('@LoginForm: Component unmounted.'));

        return cancellable;
    }

    handleChange = (event) => {
        const target = event.target;

        this.setState({
            loginFailed: false,
            [target.name]: target.value
        });
    }

    handleSubmit = (event) => {
        if (this.state.username.length === 0 || this.state.password.length === 0) return;

        this.setState({
            loginLoading: true,
            cancellablePromise: this.getCancellableFetch()
        });
        
        event.preventDefault();
    }

    render() {
        const style = {
            container: {
            },
            img: {
                maxHeight: '50%',
                width: '50%',
                display: 'block',
                marginBottom: '3%',
                marginLeft: 'auto',
                marginRight: 'auto',
                // position: 'absolute',
                // top: '50%',
                // left: '50%',
                // transform: 'translate(-50%, -50%)',
            },
            root: {
                position: 'relative',
                height: '100%',
                display: 'block',
            },
            form: {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
            },
            button: {
                margin: 15,
            },
        };

        return (
            <div style={style.root} >
                {
                    this.state.registration ?
                        <div>
                            <RegisterForm
                                username={this.state.username}
                                password={this.state.password}
                                doneRegister={(e) => {
                                    this.setState({ registration: false, loginError: false, loginFailed: false });
                                }}
                                onUPChange={this.handleChange}
                            />
                        </div>
                        :
                        <form style={style.form} onSubmit={this.handleSubmit}>
                            <img src={logo} alt="Logo" style={style.img} />
                            <TextField
                                name="username"
                                hintText="Enter your username"
                                floatingLabelText="Username"
                                onKeyPress={(e) => { if (e.key === 'Enter') this.handleSubmit(e); }}
                                value={this.state.username}
                                onChange={this.handleChange}
                            />
                            <br />
                            <TextField
                                name="password"
                                type="password"
                                hintText="Enter your password"
                                floatingLabelText="Password"
                                onKeyPress={(e) => { if (e.key === 'Enter') this.handleSubmit(e); }}
                                errorText={this.state.loginFailed ? 'Username or password incorrect' : ''}
                                value={this.state.password}
                                onChange={this.handleChange}
                            />
                            <br />
                            <div style={{ margin: 'auto' }} >
                                <RaisedButton
                                    label="Login"
                                    primary
                                    disabled={this.state.username.length === 0 || this.state.password.length === 0}
                                    style={style.button}
                                    onClick={this.handleSubmit}
                                />  
                                <RaisedButton
                                    label="Register"
                                    primary
                                    disabled={this.state.username.length === 0 || this.state.password.length === 0}
                                    style={style.button}
                                    onClick={(e) => { this.setState({ registration: true }); }}
                                />
                            </div>
                            <br />
                            {
                                this.state.loginLoading ?
                                    <CircularProgress />
                                    :
                                    null
                                    
                            }
                        </form>
                }
                <ApiErrorSnackbar
                    open={this.state.loginError}
                    message="Error connecting to server!"
                />
            </div>
        );
    }
}

export default LoginForm;
