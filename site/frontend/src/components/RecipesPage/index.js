import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { GridList, GridTile } from 'material-ui/GridList';

class RecipesPage extends Component {

    static propTypes = {
        // goBack: PropTypes.func.isRequired, // TODO: goBack handler (but we might no need it here)
        ingredientIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            recipesAreLoading: false,
            recipesLoadFail: false,
            recipes: undefined,
        };
    }

    componentWillMount() {
        this.setState({ recipesAreLoading: true });
        this.fetchRecipes();
    }

    fetchRecipes = () => {
        // populate req body with id's of ingredients
        let data = {
            ingredient_ids: this.props.ingredientIds
        };

        console.log('about to fetch');
        fetch('/api/recipes/find', {
            method: 'PUT',
            credentials: 'same-origin',
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: new Headers({
                'Content-Type': 'application/json',
            })
        }).then(res => {
            this.setState({ recipesAreLoading: false });
            if (res.status !== 200) {
                throw new Error('Bad status from server');
            }
            return res.json();
        }).then(json => {
            // get image for each recipe and add as base64 encoded string
            // to each recipe object
            let recipes = json.data.recipes;  
            const fetchImagePromises = recipes.map(this.fetchRecipeImage);

            Promise.all(fetchImagePromises).then(rs => { this.setState({ recipes: rs }); });
        }).catch(err => {
            console.log('recipe loading err', err);
            this.setState({ recipesLoadFail: true });
        });
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
            console.dir(recipe);
            if (res.status !== 200) {
                throw new Error('Bad status from server');
            }
            return res.blob();
        }).then(blobData => {
            const urlCreator = window.URL || window.webkitURL;
            recipe.img_src = urlCreator.createObjectURL(blobData); // eslint-disable-line no-param-reassign
            return recipe;
        }).catch(err => {
            console.log(`recipe id=${recipe.id} load img err:`, err);
            this.setState({ recipesLoadFail: true });
        });
    }



    render() {
        const styles = {
            root: {
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
            },
            gridList: {
                width: 500,
                height: 450,
                overflowY: 'auto',
            },
        };

        /* 
        recipes::[
            {
                id::int,
                name, method::string,
                ingredients::[
                    ingredient_name::string
                ],
                img_src::base64string
            }
        ]
         */

        let toRender = this.state.recipesLoadFail ? (
            <p>Error loading.</p>
        ) : this.state.recipesAreLoading || !this.state.recipes ? (
            <p>Still loading.</p>
        ) : (
            <div style={styles.root} >
                <GridList
                    cols={2}
                    cellHeight={200}
                    padding={1}
                    style={styles.gridList}
                >
                    {this.state.recipes.map((recipe, index) => (
                        <GridTile
                            key={recipe.id}
                            title={recipe.name}
                            //actionIcon={<IconButton><StarBorder color="white" /></IconButton>}TODO:actionIcon etc
                            //actionPosition="left"
                            titlePosition="top"
                            // eslint-disable-next-line max-len
                            titleBackground="linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
                            cols={index === 0 ? 2 : 1}
                            rows={index === 0 ? 2 : 1}
                        >
                            <img src={recipe.img_src} alt={recipe.name} />
                        </GridTile>
                    ))}
                </GridList>
            </div>
        );
        
        return (
            toRender
        );
    }
    
}

export default RecipesPage;
