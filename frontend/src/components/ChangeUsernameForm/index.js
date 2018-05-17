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

function isValid(text) {
    return /^[\x00-\x7F]*$/.test(text);
}

class ChangeUsernameForm extends Component {
    static propTypes = {
        onClose: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            changeFailed: false,
            usernameTaken: false,

            cancellableFetch: undefined
        };
    }

    componentWillUnmount = () => {
        if (this.state.cancellableFetch) this.state.cancellableFetch.cancel();
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
        }).then((res) => {
            // this.setState({ changeLoading: false });
            if (res.status === 200) {
                // Successful registration
                this.props.onClose(true);
            }
            else if (res.status === 409) {
                this.setState({ usernameTaken: true });
            }
            else if (res.status === 422) {
                throw new Error('Character(s) not allowed in username!');
            }
            else {
                throw new Error('Server error');
            }
        }).catch((err) => {
            this.setState({ changeFailed: true });
        }));

        cancellable.promise
            .then(() => {
                console.log('@ChangeUsernameForm: Changed username.');
                this.setState({
                    cancellableFetch: undefined
                });
            })
            .catch((err) => console.log('@ChangeUsernameForm: Component unmounted.'));

        return cancellable;
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

        this.setState({
            changeFailed: false,
            cancellableFetch: this.getCancellableFetch()
        });

        event.preventDefault();
    }

    validateForm = () => {
        if (this.state.username.length < 3) return false;
        if (!isValid(this.state.username)) return false;
        return true;
    }

    usernameErrorText = () => {
        if (!isValid(this.state.username)) return 'Character(s) not allowed';
        if (this.state.usernameTaken) return 'Username already taken';
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
