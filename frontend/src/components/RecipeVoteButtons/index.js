import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './style.css';
//import downvoteSvg from './downvote.svg';
//import upvoteSvg from './upvote.svg';

class RecipeVoteButtons extends Component {
    
    static propTypes = {
        nvotes: PropTypes.number.isRequired,
        handleUpvote: PropTypes.func.isRequired,
        handleDownvote: PropTypes.func.isRequired,
        upvoted: PropTypes.bool.isRequired,
        downvoted: PropTypes.bool.isRequired,
    }

    render() {

        let svgFills = {
            downvote: {
                color: 'rgba(0, 0, 0, 0.87)',
                fill: this.props.downvoted ? 'rgb(0, 188, 212)' : 'rgba(0, 0, 0, 0.54)',
            },
            upvote: {
                color: 'rgba(0, 0, 0, 0.87)',
                fill: this.props.upvoted ? 'rgb(0, 188, 212)' : 'rgba(0, 0, 0, 0.54)',
            }
        };

        let downvoteSvg = (
            <svg
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                width="444.819px"
                height="444.819px"
                viewBox="0 0 444.819 444.819"
                xmlSpace="preserve"
                className={style.downvote}
                style={svgFills.downvote}
            >
                <g>
                    { /* eslint-disable max-len */ }
                    <path d="M434.252,114.203l-21.409-21.416c-7.419-7.04-16.084-10.561-25.975-10.561c-10.095,0-18.657,3.521-25.7,10.561
                                L222.41,231.549L83.653,92.791c-7.042-7.04-15.606-10.561-25.697-10.561c-9.896,0-18.559,3.521-25.979,10.561l-21.128,21.416
                                C3.615,121.436,0,130.099,0,140.188c0,10.277,3.619,18.842,10.848,25.693l185.864,185.865c6.855,7.23,15.416,10.848,25.697,10.848
                                c10.088,0,18.75-3.617,25.977-10.848l185.865-185.865c7.043-7.044,10.567-15.608,10.567-25.693
                                C444.819,130.287,441.295,121.629,434.252,114.203z"
                    />
                    { /* eslint-enable max-len */ }
                </g>
            </svg>
        );

        let upvoteSvg = (
            <svg
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                width="444.819px"
                height="444.819px"
                viewBox="0 0 444.819 444.819"
                xmlSpace="preserve"
                className={style.upvote}
                style={svgFills.upvote}
            >
                <g>
                    { /* eslint-disable max-len */ }
                    <path d="M433.968,278.657L248.387,92.79c-7.419-7.044-16.08-10.566-25.977-10.566c-10.088,0-18.652,3.521-25.697,10.566
                                L10.848,278.657C3.615,285.887,0,294.549,0,304.637c0,10.28,3.619,18.843,10.848,25.693l21.411,21.413
                                c6.854,7.23,15.42,10.852,25.697,10.852c10.278,0,18.842-3.621,25.697-10.852L222.41,213.271L361.168,351.74
                                c6.848,7.228,15.413,10.852,25.7,10.852c10.082,0,18.747-3.624,25.975-10.852l21.409-21.412
                                c7.043-7.043,10.567-15.608,10.567-25.693C444.819,294.545,441.205,285.884,433.968,278.657z"
                    />
                    { /* eslint-enable max-len */ }
                </g>
            </svg>
        );

        return (
            <React.Fragment>
                <div
                    className={style.vote_container}
                    onClick={this.props.handleUpvote}
                    onKeyPress={this.props.handleUpvote}
                    role="button"
                    tabIndex={0}
                >
                    { upvoteSvg }
                </div>
                <div className={style.vote_count} >
                    { this.props.nvotes }
                </div>
                <div
                    className={style.vote_container}
                    onClick={this.props.handleDownvote}
                    onKeyPress={this.props.handleDownvote}
                    role="button"
                    tabIndex={-1}
                >
                    { downvoteSvg }
                </div>
                
            </React.Fragment>
        );
    }
}

export default RecipeVoteButtons;
