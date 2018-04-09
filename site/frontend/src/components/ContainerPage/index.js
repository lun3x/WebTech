import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';

import NavBar from '../NavBar';
import CupboardPage from '../CupboardPage';
import SettingsPage from '../SettingsPage';

class ContainerPage extends Component {

    static propTypes = {
        logout: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            selectedPage: 0, // default is CupboardPage
        };
    }

    selectPage = (ix) => this.setState({ selectedPage: ix });


    render() {
        let page = null;
        switch (this.state.selectedPage) {
        case 0:
            page = (
                <CupboardPage />
            );
            break;
        case 1:
            page = (
                <SettingsPage logout={this.props.logout} />
            );
            break;
        default:
            page = (
                <CupboardPage />
            );
            break;
        }

        const pageStyle = {
            width: '100%',
            height: '100%',
            minHeight: '200',
        };

        return (
            <div style={pageStyle} >
                { page }

                <NavBar selectPageHandler={this.selectPage} />
            </div>
        );
    }
}

export default ContainerPage;
