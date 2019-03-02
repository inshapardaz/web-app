import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { Dropdown } from 'semantic-ui-react';
import { addCategory } from '../actions/dataActions';


const convertCategoryOptions = (category) => 
     category.items.map(obj =>{ 
        var rObj = {};
        rObj["key"] = obj.id;
        rObj["text"] = obj.name;
        rObj["value"] = obj.id;
        return rObj;
     });

const valuesToCategories = (values) =>  values.map(obj =>{ 
        var rObj = {};
        rObj["id"] = obj;
        return rObj;
     });

const categoriesToValues = (values) => values.map(obj => obj.id)

class CategoriesDropDown extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
    }

    handleChange = (e, { value }) => this.props.onChange(valuesToCategories(value))
    handleAdd =  async(e, { value }) => {
        const {addCategory, addCategoryLink } = this.props;
        await addCategory(addCategoryLink, value);
    }
    render() {
        const { options, value, placeholder, disabled, error, addCategoryLink } = this.props;
        return (
            <Dropdown
                fluid
                selection
                multiple={true}
                options={options}
                search={true}
                value={value ? categoriesToValues(value) : []}
                error={error}
                allowAdditions={addCategoryLink!= null}
                placeholder={placeholder}
                onChange={this.handleChange}
                onAddItem={this.handleAdd}
                disabled={disabled}
            />
        )
    }
}

export default connect(
    (state, props) => ({
        isFetching: false,
        multiple: false,
        value: props.value,
        search: true,
        searchQuery: null,
        addCategoryLink : state.apiReducers.categories.links.create,
        options: convertCategoryOptions(state.apiReducers.categories)
    }),
    dispatch => bindActionCreators({
        addCategory: addCategory
    }, dispatch)
)(CategoriesDropDown)

