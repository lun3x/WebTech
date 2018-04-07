import React, { Component } from 'react';
import { Snackbar } from 'material-ui';
import fetch from 'cross-fetch';
import PropTypes from 'prop-types';

class ApiErrorSnackbar extends Component {

    static propTypes = {
        open: PropTypes.bool.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            open: true,
        };
    }

    handleClose = () => {
        this.setState({
            open: false,
        });
    };


    render() {
        const error = 'Error fetching data';
        const style = {};

        return (
            <Snackbar
                open={this.props.open && this.state.open}
                style={style}
                message={error}
                autoHideDuration={4000}
                onRequestClose={this.handleClose}
            />
        );
    }
}

export default ApiErrorSnackbar;
