import React, { Component } from 'react';
import { Snackbar } from 'material-ui';
import fetch from 'cross-fetch';
import PropTypes from 'prop-types';

class ApiErrorSnackbar extends Component {

    static defaultProps = {
        message: 'Error fetching data',
    }

    static propTypes = {
        open: PropTypes.bool.isRequired,
        message: PropTypes.string,
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
        const style = {};

        return (
            <Snackbar
                open={this.props.open && this.state.open}
                style={style}
                message={this.props.message}
                autoHideDuration={4000}
                onRequestClose={this.handleClose}
            />
        );
    }
}

export default ApiErrorSnackbar;
