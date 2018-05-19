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
    return /^[\x00-\x7F]*$/.test(text);
}

class ChangeUsernameForm extends Component {
    static propTypes = {
        onClose: PropTypes.func.isRequired,
        logout: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            changeFailed: false,
            usernameTaken: false,
            charsNotAllowed: false,

            cancellablePromise: undefined
        };
    }

    componentWillUnmount = () => {
        if (this.state.cancellablePromise) this.state.cancellablePromise.cancel();
    }

    getCancellableFetch = () => {
        let cancellable = makeCancellable(fetch(`/auth/changeUsername`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.username
            })
        }));
        
        cancellable
            .then(res => {
                // this.setState({ changeLoading: false });
                this.setState({ cancellablePromise: makeCancellableVal(res) });

                //== Self-unmounting calls ==//
                if (res.status === 401) {
                    console.log('@ChangeUsernameForm: logging out');
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
                if (res.status === 409) {
                    this.setState({ usernameTaken: true });
                }
                else if (res.status === 422) {
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
                console.log('@ChangeUsernameForm: Changed username.');
            })
            .catch((err) => console.log('@ChangeUsernameForm: Component unmounted.'));

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
        if (this.state.username.length < 3) return false;
        if (!isValid(this.state.username)) return false;
        return true;
    }

    usernameErrorText = () => {
        if (!isValid(this.state.username) || this.state.charsNotAllowed) return 'Character(s) not allowed';
        if (this.state.usernameTaken) return 'Username already taken';
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
                        name="username"
                        hintText="Enter new username"
                        floatingLabelText="New username"
                        errorText={this.usernameErrorText()}
                        value={this.state.username}
                        onChange={(e) => {
                            this.setState({ usernameTaken: false });
                            this.handleChange(e);
                        }}
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
                    message="Failed to change username."
                />
            </React.Fragment>
        );
    }
}

export default ChangeUsernameForm;
