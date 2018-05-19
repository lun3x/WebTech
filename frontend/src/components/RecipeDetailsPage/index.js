import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';
import Avatar from 'material-ui/Avatar';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import { RaisedButton } from 'material-ui';
import makeCancellable from '../../promiseWrapper';
import ApiErrorSnackbar from '../ApiErrorSnackbar';
import makeCancellableVal from '../../valueWrapper';
import RecipeVoteButtons from '../RecipeVoteButtons';

class RecipeDetailsPage extends Component {

    static propTypes = {
        goBack: PropTypes.func.isRequired,
        recipe: PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            method: PropTypes.string.isRequired,
            img_src: PropTypes.string.isRequired,
        }).isRequired,
        logout: PropTypes.func.isRequired
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

            ingredientsAreLoading: false,
            ingredientsLoadFail: false,

            recipeNotFound: false,

            upvoteFail: false,
            downvoteFail: false
        };
    }

    componentWillMount = () => {
        this.setState({ ingredientsAreLoading: true });

        this.setState({
            cancellableIngredients: this.getCancellableIngredients(),
            cancellableVoteStatus: this.getCancellableVoteStatus()
        });
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
        }));
        
        cancellable
            .then(res => {
                // Save intermediate cancellable
                this.setState({
                    cancellableVoteStatus: makeCancellable(res.json()),
                });

                if (res.status === 404) {
                    this.setState({ recipeNotFound: true });
                }

                return this.state.cancellableVoteStatus;
            })
            .then(json => {
                this.setState({
                    votes: json.votes,
                    upvoted: json.upvoted,
                    downvoted: json.downvoted,
                    cancellableVoteStatus: undefined
                });
            })
            .then(() => {
                console.log('Got vote status.');
            })
            .catch((err) => console.log('Component unmounted.'));

        return cancellable;
    }

    getCancellableIngredients = () => {
        let cancellable = makeCancellable(fetch(`/api/recipes/ingredients/${this.props.recipe.id}`, {
            method: 'GET',
            credentials: 'same-origin'
        }));

        cancellable
            .then(res => {
                this.setState({
                    ingredientsAreLoading: false,
                    cancellableIngredients: makeCancellable(res.json()),
                });

                if (!res.ok) {
                    console.log('LOAD FAIL');
                    this.setState({ ingredientsLoadFail: true });
                }

                return this.state.cancellableIngredients;
            })
            .then(json => {
                this.setState({
                    ingredients: json.data.ingredients.map(i => i.name),
                    cancellableIngredients: undefined
                });
            })
            .then(() => console.log('@RecipeDetailsPage: Got recipe ingredients.'))
            .catch((err) => console.log('@RecipeDetailsPage: Component unmounted.'));

        return cancellable;
    }

    getCancellableUpvote = () => {
        let cancellable = makeCancellable(fetch(`/api/recipes/${this.props.recipe.id}/upvote`, {
            method: 'PUT',
            credentials: 'same-origin'
        }));
        
        cancellable
            .then(res => {
                this.setState({
                    cancellableUpvote: makeCancellableVal(res),
                });

                if (res.status === 401) {
                    console.log('@RecipeDetailsPage: logging out');
                    this.props.logout();
                }

                return this.state.cancellableUpvote;
            })
            .then(res => {
                this.setState({
                    cancellableUpvote: makeCancellable(res.json()),
                });

                if (!res.ok) {
                    this.setState({ upvoteFail: true });
                }
                
                return this.state.cancellableUpvote;
            })
            .then(json => {
                if (!this.state.upvoteFail) {
                    if (this.state.upvoted)          this.setState({ votes: this.state.votes - 1 });
                    else if (this.state.downvoted)   this.setState({ votes: this.state.votes + 2 });
                    else                             this.setState({ votes: this.state.votes + 1 });
                    this.setState({
                        upvoted: json.upvoted,
                        downvoted: json.downvoted,
                    });
                }

                this.setState({ cancellableUpvote: undefined });
            })
            .then(() => console.log('Upvoted.'))
            .catch((err) => console.log('Component unmounted.'));

        return cancellable;
    }

    getCancellableDownvote = () => {
        let cancellable = makeCancellable(fetch(`/api/recipes/${this.props.recipe.id}/downvote`, {
            method: 'PUT',
            credentials: 'same-origin'
        }));
        
        cancellable
            .then(res => {
                this.setState({
                    cancellableDownvote: makeCancellableVal(res),
                });

                if (res.status === 401) {
                    console.log('@RecipeDetailsPage: logging out');
                    this.props.logout();
                }

                return this.state.cancellableDownvote;
            })
            .then(res => {
                this.setState({
                    cancellableDownvote: makeCancellable(res.json()),
                });
                
                if (!res.ok) {
                    this.setState({ downvoteFail: true });
                }
                
                return this.state.cancellableDownvote;
            })
            .then(json => {
                if (!this.state.downvoteFail) {
                    if (this.state.upvoted)        this.setState({ votes: this.state.votes - 2 });
                    else if (this.state.downvoted) this.setState({ votes: this.state.votes + 1 });
                    else                           this.setState({ votes: this.state.votes - 1 });

                    this.setState({
                        upvoted: json.upvoted,
                        downvoted: json.downvoted
                    });
                }

                this.setState({ cancellableDownvote: undefined });
            })
            .then(() => console.log('Downvoted.'))
            .catch((err) => console.log('Component unmounted.'));

        return cancellable;
    }

    handleUpvote = () => {
        this.setState({
            upvoteFail: false,
            cancellableUpvote: this.getCancellableUpvote()
        });
    }

    handleDownvote = () => {
        this.setState({
            downvoteFail: false,
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
            },
        };

        return (
            <React.Fragment>
                {
                    this.state.recipeNotFound ? (<p>Recipe not found.</p>) : (
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
                                overlay={<CardTitle title={this.props.recipe.name} />}
                            >
                                <img src={this.props.recipe.img_src} alt="failed to load" /> 
                            </CardMedia>
                            <CardActions>
                                <RecipeVoteButtons
                                    nvotes={this.state.votes}
                                    handleUpvote={this.handleUpvote}
                                    handleDownvote={this.handleDownvote}
                                    upvoted={this.state.upvoted}
                                    downvoted={this.state.downvoted}
                                />
                            </CardActions>
                            { /* <CardTitle title="Card title" subtitle="Card subtitle" /> */ }
                            <CardText>
                                <div style={styles.body}>
                                    <span> <b>Ingredients</b> </span>
                                    {
                                        this.state.ingredientsAreLoading ?
                                            <CircularProgress />
                                            :
                                            this.state.ingredientsLoadFail ?
                                                <p>Error loading ingredients.</p>
                                                :
                                                <p>{this.state.ingredients.join('\n')}</p>
                                    }
                                    <span> <b>Method</b> </span>
                                    <p>{this.props.recipe.method}</p>
                                </div>
                            </CardText>
                        </Card>
                    )
                }
            </React.Fragment>
        );
    }
}




export default RecipeDetailsPage;
