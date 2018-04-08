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
            registerLoading: false,
            registerError: false,
            registerFailed: false,
            usernameTaken: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.usernameErrorText = this.usernameErrorText.bind(this);
        this.passwordErrorText = this.passwordErrorText.bind(this);
    }

    handleChange(event) {
        const target = event.target;

        this.setState({
            [target.name]: target.value
        });
    }

    handleSubmit(event) {
        this.setState({ registerLoading: true });

        fetch(`/auth/register`, {
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
        }).then((res) => {
            this.setState({ registerLoading: false });
            if (res.status === 201) {
                // Successful registration
                this.props.doneRegister(false);
            }
            else if (res.status !== 409) {
                throw new Error('Bad status from server.');
            }
            return res.json();
        }).then((json) => {
            if (json.fail === 'usernameTaken') {
                this.setState({ usernameTaken: true });
            }
            else if (json.fail === 'usernameChar') {
                alert('Character(s) not allowed in username!');
            }
            else if (json.fail === 'passwordChar') {
                alert('Character(s) not allowed in password!');
            }
        }).catch((err) => {
            this.setState({ registerError: true });
        });

        event.preventDefault();
    }

    validateForm() {
        if (this.props.password !== this.state.password2) return false;
        if (this.props.password.length < 3) return false;
        if (this.props.username.length < 3) return false;
        if (!isValid(this.props.username, 'username')) return false;
        if (!isValid(this.props.password, 'password')) return false;
        return true;
    }

    usernameErrorText() {
        if (!isValid(this.props.password, 'username')) return 'Character(s) not allowed';
        if (this.state.usernameTaken) return 'Username already taken';
        return '';
    }

    passwordErrorText() {
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
                <br />
                <RaisedButton
                    label="Register"
                    primary
                    disabled={!this.validateForm()}
                    style={style}
                    onClick={this.handleSubmit}
                />
                {this.state.registerLoading}
                {this.state.registerError}
                {this.state.registerFailed}
            </div>
        );
    }
}

export default RegisterForm;
