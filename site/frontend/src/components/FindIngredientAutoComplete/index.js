import React, { Component } from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import PropTypes from 'prop-types';

class FindIngredientAutoComplete extends Component {

    static defaultProps = {
        ingredients: [],
        addFoodAwaitingResponse: false,
        addFoodSuccess: false,
        addFoodFail: false
    };

    static propTypes = {
        ingredients: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string
        })),
        setDirty: PropTypes.func.isRequired,
        handleSubmit: PropTypes.func.isRequired,
        addFoodAwaitingResponse: PropTypes.bool,
        addFoodSuccess: PropTypes.bool,
        addFoodFail: PropTypes.bool,
    };

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
        if (this.props.addFoodAwaitingResponse) {
            statusText = 'Adding ingredient...';
            textStyle  = style.statusTextAwaiting;
        }
        else if (this.props.addFoodFail) {
            statusText = 'Can\'t update your cupboard :(';
            textStyle  = style.statusTextError;
        }
        else if (this.props.addFoodSuccess) {
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
                    onNewRequest={this.props.handleSubmit}
                />
                <div>
                    <p {...textStyle} >{statusText}</p>
                </div>
            </div>
        );
    }


}

export default FindIngredientAutoComplete;
