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

function isValid(text) {
    return /^[\x00-\xFF]*$/.test(text);
}

class ChangePasswordForm extends Component {
    static propTypes = {
        onClose: PropTypes.func.isRequired,
        logout: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            password: '',
            password2: '',
            changeFailed: false,
            charsNotAllowed: false,

            cancellablePromise: undefined
        };
    }

    componentWillUnmount = () => {
        if (this.state.cancellablePromise) this.state.cancellablePromise.cancel();
    }

    getCancellableFetch = () => {
        let cancellable =  makeCancellable(fetch(`/auth/changePassword`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: this.state.password
            })
        }));

        cancellable
            .then(res => {
                // Save intermediate cancellable
                this.setState({ cancellablePromise: makeCancellableVal(res) });
                
                //== Self-unmounting calls ==//
                if (res.status === 401) {
                    console.log('@ChangePasswordForm: logging out');
                    this.props.logout(); 
                }
                else if (res.ok) {
                    // Successful change
                    this.props.onClose(true);
                }
                
                return this.state.cancellablePromise;
            })
            .then(res => {
                //== State-setting calls ==//
                if (res.status === 422) {
                    this.setState({ charsNotAllowed: true });
                }
                else {
                    this.setState({ changeFailed: true });
                }

                // Reset cancellable
                this.setState({ cancellablePromise: undefined });
            })
            .then(() => {
                //== Confirmation ==//
                console.log('@ChangePasswordForm: Changed password.');
            })
            .catch((err) => console.log('@ChangePasswordForm: Component unmounted.'));

        return cancellable;
    }

    handleChange = (event) => {
        const target = event.target;

        this.setState({
            [target.name]: target.value,
            charsNotAllowed: false
        });
    }

    handleSubmit = (event) => {
        if (!this.validateForm()) {
            event.preventDefault();
            return;
        }

        this.setState({
            changeFailed: false,
            cancellablePromise: this.getCancellableFetch()
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
        if (!isValid(this.state.password) || this.state.charsNotAllowed) return 'Character(s) not allowed';
        return '';
    }

    render() {
        const style = {
            margin: 15,
        };

        return (
            <React.Fragment>
                <form onSubmit={this.handleSubmit} style={{ marginLeft: '2em' }} >
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
