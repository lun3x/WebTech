import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import ChangePasswordForm from '../ChangePasswordForm';
import ApiErrorSnackbar from '../ApiErrorSnackbar';
import ChangeUsernameForm from '../ChangeUsernameForm';

const style = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    changeBox: {
        margin: 15
    }
};

class SettingsPage extends Component {

    static propTypes = {
        logout: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            changeOpen: false,
            changePassSuccess: false,
            changeUserSuccess: false
        };
    }

    handlePassClose = (success) => {
        this.setState({ changeOpen: false, changePassSuccess: success });
    }

    handleUserClose = (success) => {
        this.setState({ changeOpen: false, changeUserSuccess: success });
    }

    render() {
        return (
            <div style={style.root} >
                <List style={{ width: '100%' }} >
                    <Subheader>General</Subheader>
                    <ListItem
                        primaryText={'A Dummy item'}
                    />
                    <ListItem
                        primaryText={'Sign out'}
                        style={{ color: 'red' }}
                        onClick={this.props.logout}
                    />
                    <Divider />
                    <Subheader>Account</Subheader>
                    {
                        this.state.changeOpen ?
                            null
                            :
                            <ListItem
                                primaryText={'Change username or password'}
                                onClick={e => this.setState({ changeOpen: true, changeUserSuccess: false, changePassSuccess: false })}
                            />
                    }
                </List>

                {
                    this.state.changeOpen ?
                        <React.Fragment>
                            <ChangePasswordForm
                                onClose={this.handlePassClose}
                                logout={this.props.logout}
                            />
                            <ChangeUsernameForm
                                onClose={this.handleUserClose}
                                logout={this.props.logout}
                            />
                        </React.Fragment>
                        :
                        null
                }

                <ApiErrorSnackbar
                    open={this.state.changePassSuccess}
                    message="Successfully changed password."
                />

                <ApiErrorSnackbar
                    open={this.state.changeUserSuccess}
                    message="Successfully changed username."
                />
                
            </div>
        );
    }
}

export default SettingsPage;
