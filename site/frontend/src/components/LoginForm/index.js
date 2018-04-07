import React, { Component } from 'react';
import { Paper } from 'material-ui';
import fetch from 'cross-fetch';
import FindRecipesButton from '../FindRecipesButton';
import IngredientList from '../IngredientsList';
import ApiErrorSnackbar from '../ApiErrorSnackbar';

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
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
        alert("Login submitted!");
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Username:
                    <input
                        name="username"
                        type="text"
                        value={this.state.username}
                        onChange={this.handleChange} />
                    <br/>
                    Password:
                    <input
                        name="password"
                        type="text"
                        value={this.state.password}
                        onChange={this.handleChange} />
                    <br/>
                    <input type="submit" value="Login" />
                </label>
            </form>
        );
    }
}

export default LoginForm;
