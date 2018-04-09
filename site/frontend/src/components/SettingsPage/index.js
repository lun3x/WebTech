import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

const style = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
};

class SettingsPage extends Component {

    static propTypes = {
        logout: PropTypes.func.isRequired,
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
                    <ListItem
                        primaryText={'Change password'}
                        secondaryText={'This isn\'t implemented yet'}
                    />
                    <ListItem
                        primaryText={'And another setting'}
                        secondaryText={'This isn\'t implemented yet'}
                    />
                </List>
            </div>
        );
    }
}

export default SettingsPage;
