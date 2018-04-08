import React, { Component } from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import PropTypes from 'prop-types';

class FindIngredientAutoComplete extends Component {

    static defaultProps = {
        ingredients: []
    };

    static propTypes = {
        ingredients: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string
        })),
        setDirty: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            addFoodAwaitingResponse: false,
            addFoodSuccess: false,
            addFoodFail: false,
        };
    }

    handleSubmit = (chosenRequest, index) => {
        console.log('handle submit', chosenRequest, index);

        if (index === -1) {
            // just ignore unless an item in list menu is selected
        }
        else {
            // make an api call to add the selected ingredient to the current cupboard
            let ingredientId = this.props.ingredients[index].id;
            let cupboardId = 1;
            fetch(`/api/cupboards/${cupboardId}/add/${ingredientId}`, { method: 'PUT' })
                .then(res => {
                    this.setState({ addFoodAwaitingResponse: false });

                    if (res.status !== 200) {
                        throw new Error('Bad status from server');
                    }
                    return res.json();
                })
                .then(json => {
                    this.setState({ addFoodSuccess: true });
                    this.props.setDirty();
                })
                .catch(err => {
                    this.setState({ addFoodFail: true });
                });
        }
    }

    render() {
        const style = {
            statusTextAwaiting: {
                color: 'orange',
            },
            statusTextError: {
                color: 'red',
            },
            statusTextSuccess: {
                color: 'green',
            }
        };

        let statusText = '';
        let textStyle  = null;
        if (this.state.addFoodAwaitingResponse) {
            statusText = 'Adding ingredient...';
            textStyle  = style.statusTextAwaiting;
        }
        else if (this.state.addFoodFail) {
            statusText = 'Can\'t update your cupboard :(';
            textStyle  = style.statusTextError;
        }
        else if (this.state.addFoodSuccess) {
            statusText = 'Added ingredient :)';
            textStyle  = style.statusTextSuccess;
        }

        return (
            <div>
                <AutoComplete
                    hintText={'\'Onions...\''}
                    filter={AutoComplete.fuzzyFilter}
                    dataSource={this.props.ingredients.map(x => x.name)}
                    maxSearchResults={10}
                    onNewRequest={this.handleSubmit}
                />
                <div>
                    <p {...textStyle} >{statusText}</p>
                </div>
            </div>
        );
    }


}

export default FindIngredientAutoComplete;
