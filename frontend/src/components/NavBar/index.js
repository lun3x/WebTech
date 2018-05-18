import React, { Component } from 'react';
import { Paper } from 'material-ui';
import fetch from 'cross-fetch';
import PropTypes from 'prop-types';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import ActionHome from 'material-ui/svg-icons/action/home';
import ActionBuild from 'material-ui/svg-icons/action/build';
import SvgIcon from 'material-ui/SvgIcon';
import ApiErrorSnackbar from '../ApiErrorSnackbar';
import CupboardPage from '../CupboardPage';
import SettingsPage from '../SettingsPage';
import home from './home.svg';

const homeIcon = <ActionHome />;
const settingsIcon = <ActionBuild />;
const suggestIcon = <SvgIcon><path d={'M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z'} /></SvgIcon>;

class NavBar extends Component {
    
    static propTypes = {
        //handleAuthChange: PropTypes.func.isRequired,
        selectPageHandler: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0, // will this stay on re-render or will use last state?
        };
    }

    selectIndex = (ix) => {
        this.setState({ selectedIndex: ix });
        this.props.selectPageHandler(ix);
    }

    render() {
        const style = {
            navBar: {
                margin: 'auto',
                paddingTop: 80,
            }
        };

        return (
            <Paper zDepth={0} style={style.navBar} >
                <BottomNavigation selectedIndex={this.state.selectedIndex}>
                    <BottomNavigationItem
                        label={'My Cupboard'}
                        icon={homeIcon}
                        onClick={() => this.selectIndex(0)}
                    />
                    <BottomNavigationItem
                        label={'Settings'}
                        icon={settingsIcon}
                        onClick={() => this.selectIndex(1)}
                    />
                    <BottomNavigationItem
                        label={'Suggest Recipes'}
                        icon={suggestIcon}
                        onClick={() => this.selectIndex(2)}
                    />
                </BottomNavigation>
            </Paper>           
        );
    }
}


export default NavBar;
