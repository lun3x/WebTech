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
            registerFailed: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateForm = this.validateForm.bind(this);
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
            } else if (res.status !== 403) {
                throw new Error('Bad status from server.');
            }
            return res.json();
        }).then((json) => {
            if (json.fail === 'usernameTaken') {
                alert('Username taken!');
            } else if (json.fail === 'usernameChar') {
                alert('Character not allowed in username!');
            } else if (json.fail === 'passwordChar') {
                alert('Character not allowed in password!');
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
        return true;
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
                    value={this.props.username}
                    onChange={this.props.onUPChange}
                />
                <br />
                <TextField
                    name="password"
                    type="password"
                    hintText="Enter your password"
                    floatingLabelText="Password"
                    value={this.props.password}
                    onChange={this.props.onUPChange}
                />
                <br />
                <TextField
                    name="password2"
                    type="password"
                    hintText="Enter your password again"
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
