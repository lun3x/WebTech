import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import { RaisedButton } from 'material-ui';
import UpvoteButton from '../UpvoteButton';
import DownvoteButton from '../DownvoteButton';
import voteStyle from './vote.css';
import makeCancellable from '../../promiseWrapper';

class RecipeDetailsPage extends Component {

    static propTypes = {
        goBack: PropTypes.func.isRequired,
        recipe: PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            method: PropTypes.string.isRequired,
            img_src: PropTypes.string.isRequired,
        }).isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            // ingredientsAreLoading: false,
            // ingredientLoadFail: False,
            ingredients: [],
            upvoted: false,
            downvoted: false,
            votes: 0,

            cancellableVoteStatus: undefined,
            cancellableIngredients: undefined,
            cancellableUpvote: undefined,
            cancellableDownvote: undefined,
        };
    }

    componentWillMount = () => {
        // this.setState({ ingredientsAreLoading: true });
        this.fetchIngredients();
        this.fetchVoteStatus();
    }

    componentWillUnmount = () => {
        if (this.state.cancellableVoteStatus) this.state.cancellableVoteStatus.cancel();
        if (this.state.cancellableIngredients) this.state.cancellableIngredients.cancel();
        if (this.state.cancellableUpvote) this.state.cancellableUpvote.cancel();
        if (this.state.cancellableDownvote) this.state.cancellableDownvote.cancel();
    }

    getCancellableVoteStatus = () => {
        let cancellable = makeCancellable(fetch(`/api/recipes/${this.props.recipe.id}/votes`, {
            method: 'GET',
            credentials: 'same-origin'
        }).then(res => {
            // this.setState({ ingredientsAreLoading: false });
            if (res.status !== 200) {
                throw new Error('Bad status from server');
            }
            return res.json();
        }).then(json => {
            this.setState({ votes: json.votes, upvoted: json.upvoted, downvoted: json.downvoted });
        }).catch(err => {
            console.log('Ingredient loading err', err);
            // this.setState({ ingredientsLoadFail: true });
        }));

        cancellable.promise
            .then(() => {
                console.log('Got vote status.');
                this.setState({ cancellableVoteStatus: undefined });
            })
            .catch((err) => console.log('Component unmounted.'));

        return cancellable;
    }

    getCancellableIngredients = () => {
        let cancellable = makeCancellable(fetch(`/api/recipes/ingredients/${this.props.recipe.id}`, {
            method: 'GET',
            credentials: 'same-origin'
        }).then(res => {
            // this.setState({ ingredientsAreLoading: false });
            if (res.status !== 200) {
                throw new Error('Bad status from server');
            }
            return res.json();
        }).then(json => {
            // get image for each recipe and add as base64 encoded string
            // to each recipe object
            // let ingredients = json.data.ingredients;
            console.log(json.data.ingredients);
            this.setState({ ingredients: json.data.ingredients.map(i => i.name) });
        }).catch(err => {
            console.log('Ingredient loading err', err);
            // this.setState({ ingredientsLoadFail: true });
        }));

        cancellable.promise
            .then(() => {
                console.log('Got recipe ingredients.');
                this.setState({ cancellableIngredients: undefined });
            })
            .catch((err) => console.log('Component unmounted.'));

        return cancellable;
    }

    getCancellableUpvote = () => {
        let cancellable = makeCancellable(fetch(`/api/recipes/${this.props.recipe.id}/upvote`, {
            method: 'PUT',
            credentials: 'same-origin'
        }).then(res => {
            if (res.status !== 200) {
                throw new Error('Failed to upvote.');
            }
            else {
                return res.json();
            }
        }).then(json => {
            if (this.state.upvoted)        this.setState({ votes: this.state.votes - 1 });
            else if (this.state.downvoted) this.setState({ votes: this.state.votes + 2 });
            else                           this.setState({ votes: this.state.votes + 1 });
            this.setState({ upvoted: json.upvoted, downvoted: json.downvoted });
        }).catch(err => {
            console.log('Upvote error: ', err);
        }));

        cancellable.promise
            .then(() => {
                console.log('Upvoted.');
                this.setState({ cancellableUpvote: undefined });
            })
            .catch((err) => console.log('Component unmounted.'));

        return cancellable;
    }

    getCancellableDownvote = () => {
        let cancellable = makeCancellable(fetch(`/api/recipes/${this.props.recipe.id}/downvote`, {
            method: 'PUT',
            credentials: 'same-origin'
        }).then(res => {
            if (res.status !== 200) {
                throw new Error('Failed to upvote.');
            }
            else {
                return res.json();
            }
        }).then(json => {
            if (this.state.upvoted)        this.setState({ votes: this.state.votes - 2 });
            else if (this.state.downvoted) this.setState({ votes: this.state.votes + 1 });
            else                           this.setState({ votes: this.state.votes - 1 });
            this.setState({ upvoted: json.upvoted, downvoted: json.downvoted });
        }).catch(err => {
            console.log('Upvote error: ', err);
        }));

        cancellable.promise
            .then(() => {
                console.log('Downvoted.');
                this.setState({ cancellableDownvote: undefined });
            })
            .catch((err) => console.log('Component unmounted.'));

        return cancellable;
    }

    fetchVoteStatus = () => {
        this.setState({
            cancellableVoteStatus: this.getCancellableVoteStatus()
        });
    }

    fetchIngredients = () => {
        this.setState({
            cancellableIngredients: this.getCancellableIngredients()
        });
    }

    handleUpvote = () => {
        this.setState({
            cancellableUpvote: this.getCancellableUpvote()
        });
    }

    handleDownvote = () => {
        this.setState({
            cancellableDownvote: this.getCancellableDownvote()
        });
    }

    render() {
        const styles = {
            header: {
                avatar: {
                    cursor: 'pointer',
                },
                title: {
                    verticalAlign: 'bottom',
                },
            },
            body: {
                whiteSpace: 'pre-wrap'
            },
            buttons: {
                margin: 15
            }
        };

        return (
            <Card>
                <CardHeader
                    title={<span><b>Go back</b></span>}
                    avatar={<Avatar
                        icon={<NavigationArrowBack />}
                        onClick={this.props.goBack}
                        style={styles.header.avatar}
                    />}
                />
                <CardMedia
                    overlay={<CardTitle title={this.props.recipe.name} /*subtitle="Overlay subtitle"*/ />}
                >
                    <img src={this.props.recipe.img_src} alt="failed to load" /*TODO: change to actual image*/ /> 
                </CardMedia>
                <CardActions>
                    <RaisedButton
                        label={this.state.votes}
                        style={styles.buttons}
                        disabled
                    />
                    <button
                        onClick={this.handleUpvote}
                        className={voteStyle.buttons}
                    >
                    Upvote
                    </button>
                    <button
                        onClick={this.handleDownvote}
                        style={voteStyle.disabled}
                    >
                    Downvote
                    </button>
                </CardActions>
                { /* <CardTitle title="Card title" subtitle="Card subtitle" /> */ }
                <CardText>
                    <div style={styles.body}>
                        <span> <b>Ingredients</b> </span>
                        <p>{this.state.ingredients.join('\n')}</p>
                        <span> <b>Method</b> </span>
                        <p>{this.props.recipe.method}</p>
                    </div>
                </CardText>
            </Card>
        );
    }
}




export default RecipeDetailsPage;
