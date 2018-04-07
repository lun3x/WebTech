import React, { Component } from 'react';
import { Paper } from 'material-ui';
import fetch from 'cross-fetch';
import PropTypes from 'prop-types';
import FindRecipesButton from '../FindRecipesButton';
import IngredientList from '../IngredientsList';
import ApiErrorSnackbar from '../ApiErrorSnackbar';

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
            loginFailed: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;

        this.setState({
            [target.name]: target.value
        });
    }

    handleSubmit(event) {
        this.setState({ loginLoading: true });

        fetch(`/auth/login`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        }).then((res) => {
            this.setState({ loginLoading: false });
            if (res.status !== 200) {
                throw new Error('Bad status from server');
            }
            return res.json();
        }).then((json) => {
            if (json.success) {
                this.props.onAuthChange(json.success);
            } else {
                this.setState({ loginFailed: true });
            }
        }).catch((err) => {
            this.setState({ loginError: true });
        });

        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                Username:
                <input
                    name="username"
                    type="text"
                    value={this.state.username}
                    onChange={this.handleChange}
                />
                <br />
                Password:
                <input
                    name="password"
                    type="text"
                    value={this.state.password}
                    onChange={this.handleChange}
                />
                <br />
                <input type="submit" value="Login" />
                {this.state.loginLoading}
                {this.state.loginError}
                {this.state.loginFailed}
            </form>
        );
    }
}

export default LoginForm;
