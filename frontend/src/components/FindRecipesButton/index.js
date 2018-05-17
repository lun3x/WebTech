import React, { Component } from 'react';
import { RaisedButton } from 'material-ui';
import PropTypes from 'prop-types';

class FindRecipesButton extends Component {

    static propTypes = {
        gotoFindRecipesPage: PropTypes.func.isRequired,
        disabled: PropTypes.bool.isRequired
    }


    render() {
        const label = 'Find Recipes';
        const style = {
            marginTop: 20,
            marginLeft: 10,
        };

        return (
            <RaisedButton
                style={style}
                label={label}
                secondary
                disabled={this.props.disabled}
                onClick={this.props.gotoFindRecipesPage}
            />
        );
    }
}

export default FindRecipesButton;
