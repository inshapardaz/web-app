import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { Dropdown } from 'semantic-ui-react';

const convertLanguageOptions = (languages) => 
        languages.map(obj =>{ 
            var rObj = {};
            rObj["key"] = obj.value;
            rObj["text"] = obj.key;
            rObj["value"] = obj.value;
            return rObj;
        });

class LanguageDropDown extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (e, { value }) => this.props.onChange(value)

    render() {
        const { options, value, placeholder, disabled, error } = this.props;
        return (
            <Dropdown
                fluid
                selection
                options={options}
                search={true}
                value={value}
                error={error}
                placeholder={placeholder}
                onChange={this.handleChange}
                disabled={disabled}
            />
        )
    }
}

export default connect(
    state => ({
        isFetching: false,
        multiple: false,
        search: true,
        searchQuery: null,
        options: convertLanguageOptions(state.apiReducers.languages)
    }),
    dispatch => bindActionCreators({}, dispatch)
)(LanguageDropDown)

