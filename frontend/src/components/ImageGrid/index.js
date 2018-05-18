import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './style.css';


class ImageGrid extends Component {

    static propTypes = {
        recipes: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            method: PropTypes.string.isRequired,
            img_src: PropTypes.string.isRequired,
        })).isRequired,
    }

    render() {

        // get the length of recipes and split into four cols
        let recipes = this.props.recipes;
        let n = recipes.length;
        let n_over_4 = Math.floor(n / 4);
        let n_mod_4  = n % 4;

        // map recipes to an image to display
        let recipe_imgs = recipes.map((recipe) => (
            <img
                key={recipe.id}
                alt={recipe.name}
                src={recipe.img_src}
            />
        ));

        return (
            <React.Fragment>
                <div className={style.row} >
                    <div className={style.column} >
                        { recipe_imgs.slice(0, n_over_4) }
                    </div>
                    <div className={style.column} >
                        { recipe_imgs.slice(n_over_4, 2 * n_over_4) }
                    </div>
                    <div className={style.column} >
                        { recipe_imgs.slice(2 * n_over_4, 3 * n_over_4) }
                    </div>
                    <div className={style.column} >
                        { recipe_imgs.slice(3 * n_over_4, 4 * n_over_4) }
                    </div>
                </div>
                <div className={style.row} >
                    <div className={style.column} >
                        { (n_mod_4 >= 1) ? recipe_imgs[4 * n_over_4] : null }
                    </div>
                    <div className={style.column} >
                        { (n_mod_4 >= 2) ? recipe_imgs[(4 * n_over_4) + 1] : null }
                    </div>
                    <div className={style.column} >
                        { (n_mod_4 >= 3) ? recipe_imgs[(4 * n_over_4) + 2] : null }
                    </div>
                    <div className={style.column} >
                        { null }
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default ImageGrid;
