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
        ingredients: [],
    };

    static propTypes = {
        ingredients: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string
        })),
        triggerCupboardReload: PropTypes.func.isRequired,
        addFoodAwaitingResponse: PropTypes.bool.isRequired,
        addFoodSuccess: PropTypes.bool.isRequired,
        addFoodFail: PropTypes.bool.isRequired,
        handleAddFood: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            open: false,   // is the dialog open
            dirty: false,  // if a new food is added, we need to trigger a reload of mycupboard
        };
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
                        addFoodAwaitingResponse={this.props.addFoodAwaitingResponse}
                        addFoodFail={this.props.addFoodFail}
                        addFoodSuccess={this.props.addFoodSuccess}
                        handleSubmit={this.props.handleAddFood}
                        ingredients={this.props.ingredients}
                        setDirty={this.props.triggerCupboardReload}
                    />
                </Dialog>
            </div>
        );
    }
}

export default AddIngredientDialog;