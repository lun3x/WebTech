import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';

class RecipeDetailsPage extends Component {

    static propTypes = {
        goBack: PropTypes.func.isRequired,
        recipe: PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            method: PropTypes.string.isRequired,
            img_src: PropTypes.string.isRequired,
        }).isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            // ingredientsAreLoading: false,
            // ingredientLoadFail: False,
            ingredients: []
        };
    }

    componentWillMount() {
        // this.setState({ ingredientsAreLoading: true });
        this.fetchIngredients();
    }

    fetchIngredients = () => {
        fetch(`/api/recipes/ingredients/${this.props.recipe.id}`, {
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
                { /* <CardTitle title="Card title" subtitle="Card subtitle" /> */ }
                <CardText>
                    <div>
                        <span> <b>Ingredients</b> </span>
                        <p>{this.state.ingredients.join(',')}</p>
                        <span> <b>Method</b> </span>
                        <p>{this.props.recipe.method}</p>
                    </div>
                </CardText>
            </Card>
        );
    }
}




export default RecipeDetailsPage;
