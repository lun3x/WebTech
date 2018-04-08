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
                    //ingredients={this.props.ingredients.map(x => x.name)}
                >
                    Search for an ingredient below.
                    <FindIngredientAutoComplete
                        ingredients={this.props.ingredients}
                        setDirty={this.props.triggerCupboardReload}
                    />
                </Dialog>
            </div>
        );
    }
}

export default AddIngredientDialog;
