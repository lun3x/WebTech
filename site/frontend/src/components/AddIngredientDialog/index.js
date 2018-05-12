import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';
import fetch from 'cross-fetch';
import IngredientPlusButton from '../IngredientPlusButton';
import FindIngredientAutoComplete from '../FindIngredientAutoComplete';

class AddIngredientDialog extends Component {

    static defaultProps = {
        ingredients: []
    };

    static propTypes = {
        ingredients: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string
        })),
        triggerCupboardReload: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            open: false,   // is the dialog open
            dirty: false,  // if a new food is added, we need to trigger a reload of mycupboard
            addFoodAwaitingResponse: false,
            addFoodSuccess: false,
            addFoodFail: false,
        };
    }

    setDirty = () => {
        if (!this.state.dirty) {
            this.setState({ dirty: true });
        }
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = (text) => {
        this.setState({ open: false });
        
        if (this.state.dirty) {
            this.props.triggerCupboardReload();
        }
    }

    handleSubmit = (chosenRequest, index) => {
        this.setState({ addFoodAwaitingResponse: true });

        if (index === -1) {
            // just ignore unless an item in list menu is selected
        }
        else {
            // make an api call to add the selected ingredient to the current cupboard
            let ingredientId = this.props.ingredients[index].id;
            fetch(`/api/cupboard/add/${ingredientId}`, {
                method: 'PUT',
                credentials: 'same-origin'
            }).then(res => {
                this.setState({ addFoodAwaitingResponse: false });

                if (res.status === 201) {
                    this.setState({ addFoodSuccess: true });
                    this.setDirty();
                }
                else {
                    this.setState({ addFoodFail: true });
                }
            });
        }
    }

    render() {
        const actions = [
            <FlatButton
                key={0}
                label="Done"
                primary
                onClick={this.handleClose}
            />,
        ];
    
        return (
            <div>
                <IngredientPlusButton onClick={this.handleOpen} />
                <Dialog
                    title={'Add Ingredient'}
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                >
                    Search for an ingredient below.
                    <FindIngredientAutoComplete
                        addFoodAwaitingResponse={this.state.addFoodAwaitingResponse}
                        addFoodFail={this.state.addFoodFail}
                        addFoodSuccess={this.state.addFoodSuccess}
                        handleSubmit={this.handleSubmit}
                        ingredients={this.props.ingredients}
                        setDirty={this.props.triggerCupboardReload}
                    />
                </Dialog>
            </div>
        );
    }
}

export default AddIngredientDialog;
