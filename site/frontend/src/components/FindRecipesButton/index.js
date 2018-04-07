import React, { Component } from 'react';
import { RaisedButton } from 'material-ui';

class FindRecipesButton extends Component {
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
            />
        );
    }
}

export default FindRecipesButton;
