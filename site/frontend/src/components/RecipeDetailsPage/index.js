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
            ingredients: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
            img_src: PropTypes.string.isRequired,
        }).isRequired,
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
                        <p>{this.props.recipe.ingredients.join('\n')}</p>
                        <span> <b>Method</b> </span>
                        <p>{this.props.recipe.method}</p>
                    </div>
                </CardText>
            </Card>
        );
    }
}




export default RecipeDetailsPage;
