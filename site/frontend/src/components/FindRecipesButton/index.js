import React, { Component } from 'react';
import { RaisedButton } from 'material-ui';
import PropTypes from 'prop-types';

class FindRecipesButton extends Component {

    static propTypes = {
        gotoFindRecipesPage: PropTypes.func.isRequired,
    }


    render() {
        const label = 'Find Recipes';
        const style = {
            marginTop: 20,
        };

        return (
            <RaisedButton
                style={style}
                label={label}
                secondary
                onClick={this.props.gotoFindRecipesPage}
            />
        );
    }
}

export default FindRecipesButton;
