import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/CircularProgress';
import RecipeDetailsPage from '../RecipeDetailsPage';
import makeCancellable from '../../promiseWrapper';
import makeCancellableVal from '../../valueWrapper';
import ImageGrid from '../ImageGrid';

class RecipesPage extends Component {

    static propTypes = {
        ingredientIds: PropTypes.arrayOf(PropTypes.number).isRequired,
        logout: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            recipesAreLoading: false,
            recipesLoadFail: false,
            recipes: [],
            selectedRecipe: undefined,

            cancellableRecipes: undefined,
            cancellableRecipeImages: undefined
        };
    }

    componentWillMount = () => {
        this.setState({
            recipesAreLoading: true,
            cancellableRecipes: this.getCancellableRecipes()
        });
    }

    componentWillUnmount = () => {
        if (this.state.cancellableRecipes) this.state.cancellableRecipes.cancel();
        if (this.state.cancellableRecipeImages) this.state.cancellableRecipeImages.cancel();
    }

    getCancellableRecipes = () => {
        let data = {
            ingredient_ids: this.props.ingredientIds
        };

        let cancellable = makeCancellable(fetch('/api/recipes/find', {
            method: 'PUT',
            credentials: 'same-origin',
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: new Headers({
                'Content-Type': 'application/json',
            })
        }));
        
        cancellable
            .then(res => {
                this.setState({
                    cancellableRecipes: makeCancellable(res.json())
                });

                if (res.status === 401) {
                    console.log('@RecipesPage: Logging out!');
                    this.props.logout();
                }
                else if (!res.ok) {
                    this.setState({ recipesLoadFail: true });
                }
                return this.state.cancellableRecipes;
            })
            .then(json => {
                // get image for each recipe and add as base64 encoded string
                // to each recipe object
                let recipes = json.data.recipes;  
                const fetchImagePromises = recipes.map(this.fetchRecipeImage);

                this.setState({
                    cancellableRecipeImages: this.getCancellableRecipeImages(fetchImagePromises),
                    cancellableRecipes: undefined,
                });
            })
            .then(() => console.log('@RecipesPage|Recipes: Got recipes.'))
            .catch((err) => console.log('@RecipesPage|Recipes: Component unmounted.'));

        return cancellable;
    }

    getCancellableRecipeImages = (fetchImagePromises) => {
        let cancellable = makeCancellable(Promise.all(fetchImagePromises));

        cancellable
            .then(rs => {
                this.setState({ recipes: rs });
            })
            .catch(err => {
                this.setState({ cancellableRecipeImages: makeCancellableVal(err) });
                
                console.log('@RecipesPage: Logging out!');
                this.props.logout();

                return this.state.cancellableRecipeImages;
            })
            .then(err => {
                console.log('@RecipesPage|RecipeImages: Got recipes.');
                this.setState({
                    cancellableRecipeImages: undefined,
                    recipesAreLoading: false
                });
            })
            .catch((err) => console.log('@RecipesPage|RecipeImages: Component unmounted.'));
            
        return cancellable;
    }

    fetchRecipeImage = (recipe, i) => {
        //let recipe = recipes[i];
        return fetch(`/api/recipes/image/${recipe.id}`, {
            method: 'GET',
            credentials: 'same-origin',
            headers: new Headers({
                'Content-Type': 'image/png',
                //responseType: 'arraybuffer',
            })
        }).then(res => {
            if (res.status === 401) {
                throw new Error('Access Denied.');
            }
            if (!res.ok) {
                console.log(`recipe id=${recipe.id} load img err`);
                this.setState({ recipesLoadFail: true });
            }
            return res.blob();
        }).then(blobData => {
            const urlCreator = window.URL || window.webkitURL;
            recipe.img_blob = blobData; // eslint-disable-line no-param-reassign
            recipe.img_src = urlCreator.createObjectURL(blobData); // eslint-disable-line no-param-reassign
            return recipe;
        });
    }

    loadRecipePage = (recipe) => {
        this.setState({ selectedRecipe: recipe });
    }

    goBack = () => {
        this.setState({ selectedRecipe: undefined });
    }

    render() {
        const styles = {
            root: {
                height: '100%',
                padding: '1em',

            },
            gridList: {
                width: '100%',
                height: '100%',
                overflowY: 'auto',
            },
            gridTile: {
                cursor: 'pointer',
            },
            titleStyle: {
                //color: 'rgb(0, 188, 212)',
            },
        };

        /* 
        recipes::[
            {
                id::int,
                name, method::string,
                img_src::base64string
            }
        ]
         */

        let toRender = this.state.recipesLoadFail ? (
            <p>Error loading.</p>
        ) : this.state.recipesAreLoading || !this.state.recipes ? (
            <CircularProgress />
        ) : this.state.selectedRecipe ? (
            <RecipeDetailsPage recipe={this.state.selectedRecipe} goBack={this.goBack} logout={this.props.logout} />
        ) : this.state.recipes.length === 0 ? (
            <p>No recipes found!</p>
        ) : (
            <ImageGrid recipes={this.state.recipes} loadRecipePage={this.loadRecipePage} />
        );
        
        return (
            toRender
        );
    }
    
}

export default RecipesPage;
