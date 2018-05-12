import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import ChangePasswordForm from '../ChangePasswordForm';
import ApiErrorSnackbar from '../ApiErrorSnackbar';

const style = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    changePass: {
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
            changePassOpen: false,
            changeSuccess: false
        };
    }

    handleOpen = () => {
        this.setState({ changePassOpen: true, changeSuccess: false });
    }

    handleClose = (success) => {
        this.setState({ changePassOpen: false, changeSuccess: success });
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
                    <ListItem
                        primaryText={'Change username'}
                        secondaryText={'This isn\'t implemented yet'}
                    />
                    {
                        this.state.changePassOpen ?
                            null
                            :
                            <ListItem
                                primaryText={'Change password'}
                                onClick={this.handleOpen}
                            />
                    }
                </List>

                {
                    this.state.changePassOpen ?
                        <div style={style.changePass}>
                            <ChangePasswordForm
                                onClose={this.handleClose}
                            />
                        </div>
                        :
                        null
                }

                <ApiErrorSnackbar
                    open={this.state.changeSuccess}
                    message="Successfully changed password."
                />
                
            </div>
        );
    }
}

export default SettingsPage;
