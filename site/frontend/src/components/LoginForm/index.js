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
            loginFailed: false,
            [target.name]: target.value
        });
    }

    handleSubmit(event) {
        if (this.state.username.length === 0 || this.state.password.length === 0) return;

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
            if      (res.status === 200) this.props.onAuthChange(true);
            else if (res.status === 401) this.setState({ loginFailed: true });
            else    throw new Error('Bad status from server');
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
                                doneRegister={(e) => { this.setState({ registration: false, loginError: false, loginFailed: false }); }}
                                onUPChange={this.handleChange}
                            />
                        </div>
                        :
                        <form onSubmit={this.handleSubmit}>
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
                            <RaisedButton
                                label="Login"
                                primary
                                disabled={this.state.username.length === 0 || this.state.password.length === 0}
                                style={style}
                                onClick={this.handleSubmit}
                            />  
                            <RaisedButton
                                label="Register"
                                primary
                                disabled={this.state.username.length === 0 || this.state.password.length === 0}
                                style={style}
                                onClick={(e) => { this.setState({ registration: true }); }}
                            />
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
                {this.state.loginLoading}
            </div>
        );
    }
}

export default LoginForm;
