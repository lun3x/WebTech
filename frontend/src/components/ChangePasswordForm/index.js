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

function isValid(text) {
    return /^[\x00-\xFF]*$/.test(text);
}

class ChangePasswordForm extends Component {
    static propTypes = {
        onClose: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            password: '',
            password2: '',
            changeFailed: false,
        };
    }

    handleChange = (event) => {
        const target = event.target;

        this.setState({
            [target.name]: target.value
        });
    }

    handleSubmit = (event) => {
        if (!this.validateForm()) {
            event.preventDefault();
            return;
        }

        this.setState({ changeFailed: false });

        fetch(`/auth/changePassword`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: this.state.password
            })
        }).then((res) => {
            // this.setState({ changeLoading: false });
            if (res.status === 200) {
                // Successful registration
                this.props.onClose(true);
            }
            else if (res.status === 422) {
                throw new Error('Character(s) not allowed in password!');
            }
            else {
                throw new Error('Server error');
            }
        }).catch((err) => {
            this.setState({ changeFailed: true });
        });

        event.preventDefault();
    }

    validateForm = () => {
        if (this.state.password !== this.state.password2) return false;
        if (this.state.password.length < 3) return false;
        if (!isValid(this.state.username)) return false;
        if (!isValid(this.state.password)) return false;
        return true;
    }

    passwordErrorText = () => {
        if (!isValid(this.state.password)) return 'Character(s) not allowed';
        return '';
    }

    render() {
        const style = {
            margin: 15,
        };

        return (
            <React.Fragment>
                <form onSubmit={this.handleSubmit}>
                    <TextField
                        name="password"
                        type="password"
                        hintText="Enter new password"
                        floatingLabelText="Password"
                        errorText={this.passwordErrorText()}
                        value={this.state.password}
                        onChange={this.handleChange}
                    />
                    <br />
                    <TextField
                        name="password2"
                        type="password"
                        hintText="Enter new password again"
                        errorText={this.state.password !== this.state.password2 ? 'Passwords must match' : ''}
                        floatingLabelText="Password again"
                        value={this.state.password2}
                        onChange={this.handleChange}
                    />
                    <br />
                    <RaisedButton
                        label="Change"
                        secondary
                        disabled={!this.validateForm()}
                        style={style}
                        onClick={this.handleSubmit}
                    />
                    <RaisedButton
                        label="Close"
                        secondary
                        style={style}
                        onClick={e => { this.props.onClose(false); }}
                    />
                </form>

                <ApiErrorSnackbar
                    open={this.state.changeFailed}
                    message="Failed to change password."
                />
            </React.Fragment>
        );
    }
}

export default ChangePasswordForm;
