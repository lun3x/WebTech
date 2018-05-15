import React, { Component } from 'react';
import { RaisedButton } from 'material-ui';
import PropTypes from 'prop-types';

class UpvoteButton extends Component {

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
                className="upvote.css"
                src="static/images/upvote.png"
                alt="Upvote"
                onClick={this.props.onClick}
            />
        );
    }
}

export default UpvoteButton;
