import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import AppBar from 'material-ui/AppBar';
import { Paper } from 'material-ui';
import fetch from 'cross-fetch';
import PropTypes from 'prop-types';
import FindRecipesButton from '../FindRecipesButton';
import IngredientList from '../IngredientsList';
import ApiErrorSnackbar from '../ApiErrorSnackbar';
import makeCancellable from '../../promiseWrapper';
import makeCancellableVal from '../../valueWrapper';

function isValid(text, type) {
    if (type === 'username') return /^[\x00-\x7F]*$/.test(text);
    if (type === 'password') return /^[\x00-\xFF]*$/.test(text);
    return false;
}

class RegisterForm extends Component {
    static propTypes = {
        doneRegister: PropTypes.func.isRequired,
        onUPChange: PropTypes.func.isRequired,
        username: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            password2: '',
            name: '',
            // registerLoading: false,
            registerError: false,
            usernameTaken: false,

            cancellablePromise: undefined
        };
    }

    componentWillUnmount = () => {
        if (this.state.cancellablePromise) this.state.cancellablePromise.cancel();
    }

    getCancellableFetch = () => {
        let cancellable = makeCancellable(fetch(`/auth/register`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.props.username,
                password: this.props.password,
                name: this.state.name
            })
        }));

        cancellable
            .then((res) => {
                // this.setState({ registerLoading: false });
                this.setState({
                    cancellablePromise: makeCancellableVal(res)
                });

                if (res.ok) {
                    // Successful registration
                    this.props.doneRegister(false);
                }

                return this.state.cancellablePromise;
            }).then(res => {
                this.setState({
                    cancellablePromise: makeCancellable(res.json())
                });

                if (res.status !== 409 && res.status !== 422) {
                    this.setState({ registerError: true });
                }

                return this.state.cancellablePromise;
            }).then(json => {
                if (json.fail === 'usernameTaken') {
                    this.setState({ usernameTaken: true });
                }
                else if (json.fail === 'usernameChar') {
                    alert('Character(s) not allowed in username!');
                }
                else if (json.fail === 'passwordChar') {
                    alert('Character(s) not allowed in password!');
                }

                this.setState({ cancellablePromise: undefined });
            })
            .then(() => console.log('@RegisterForm: Registered.'))
            .catch((err) => console.log('@RegisterForm: Component unmounted.'));

        return cancellable;
    }

    handleChange = (event) => {
        const target = event.target;

        this.setState({
            [target.name]: target.value
        });

        if (target.name === 'username') {
            this.setState({ usernameTaken: false });
        }
    }

    handleSubmit = (event) => {
        this.setState({
            // registerLoading: true,
            cancellablePromise: this.getCancellableFetch()
        });

        event.preventDefault();
    }

    validateForm = () => {
        if (this.props.password !== this.state.password2) return false;
        if (this.props.password.length < 3) return false;
        if (this.props.username.length < 3) return false;
        if (!isValid(this.props.username, 'username')) return false;
        if (!isValid(this.props.password, 'password')) return false;
        return true;
    }

    usernameErrorText = () => {
        if (!isValid(this.props.username, 'username')) return 'Character(s) not allowed';
        if (this.state.usernameTaken) return 'Username already taken';
        return '';
    }

    passwordErrorText = () => {
        if (!isValid(this.props.password, 'password')) return 'Character(s) not allowed';
        return '';
    }

    render() {
        const style = {
            margin: 15,
        };

        return (
            <div>
                <TextField
                    name="username"
                    hintText="Enter your username"
                    floatingLabelText="Username"
                    errorText={this.usernameErrorText()}
                    value={this.props.username}
                    onChange={(e) => {
                        this.setState({ usernameTaken: false });
                        this.props.onUPChange(e);
                    }}
                />
                <br />
                <TextField
                    name="password"
                    type="password"
                    hintText="Enter your password"
                    floatingLabelText="Password"
                    errorText={this.passwordErrorText()}
                    value={this.props.password}
                    onChange={this.props.onUPChange}
                />
                <br />
                <TextField
                    name="password2"
                    type="password"
                    hintText="Enter your password again"
                    errorText={this.props.password !== this.state.password2 ? 'Passwords must match' : ''}
                    floatingLabelText="Password again"
                    value={this.state.password2}
                    onChange={this.handleChange}
                />
                <br />
                <TextField
                    name="name"
                    hintText="Enter your name"
                    floatingLabelText="Name"
                    value={this.state.name}
                    onChange={this.handleChange}
                />
                <br />
                <RaisedButton
                    label="Back"
                    primary
                    style={style}
                    onClick={this.props.doneRegister}
                />
                <RaisedButton
                    label="Register"
                    primary
                    disabled={!this.validateForm()}
                    style={style}
                    onClick={this.handleSubmit}
                />

                <ApiErrorSnackbar
                    open={this.state.registerError}
                    message="Failed to register user."
                />
            </div>
        );
    }
}

export default RegisterForm;
