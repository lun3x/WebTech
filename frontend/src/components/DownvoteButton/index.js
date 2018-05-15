import React, { Component } from 'react';
import { RaisedButton } from 'material-ui';
import PropTypes from 'prop-types';

class DownvoteButton extends Component {

    static propTypes = {
        onClick: PropTypes.func.isRequired,
    }


    render() {
        const label = 'Find Recipes';
        const style = {
            margins: 15,
        };

        return (
            // <button
            //     style={style}
            //     label={label}
            //     secondary
            //     disabled={this.props.disabled}
            //     onClick={this.props.gotoFindRecipesPage}
            // />
            <input
                type="image"
                className="downvote.css"
                src="static/images/downvote.png"
                alt="Downvote"
                onClick={this.props.onClick}
            />
        );
    }
}

export default DownvoteButton;
