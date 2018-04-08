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
import RegisterForm from '../RegisterForm';

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
            registration: false
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
        const style = {
            margin: 15,
        };

        return (
            <div>
                {
                    this.state.registration ?
                        <div>
                            <RegisterForm
                                username={this.state.username}
                                password={this.state.password}
                                doneRegister={(e) => { this.setState({ registration: false }); }}
                                onUPChange={this.handleChange}
                            />
                        </div>
                        :
                        <div>
                            <TextField
                                name="username"
                                hintText="Enter your username"
                                floatingLabelText="Username"
                                value={this.state.username}
                                onChange={this.handleChange}
                            />
                            <br />
                            <TextField
                                name="password"
                                type="password"
                                hintText="Enter your password"
                                floatingLabelText="Password"
                                value={this.state.password}
                                onChange={this.handleChange}
                            />
                            <br />
                            <RaisedButton
                                label="Login"
                                primary
                                style={style}
                                onClick={this.handleSubmit}
                            />
                            <RaisedButton
                                label="Register"
                                primary
                                style={style}
                                onClick={(e) => { this.setState({ registration: true }); }}
                            />
                        </div>
                }
                {this.state.loginError}
                {this.state.loginLoading}
                {this.state.loginFailed}
            </div>
        );
    }
}

export default LoginForm;
