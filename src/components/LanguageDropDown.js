import React, { Component } from 'react';
import { connect } from 'react-redux'

import { Select } from 'antd';

const Option = Select.Option;

class LanguageDropDown extends Component {
    render() {
        let options = this.props && this.props.languages ? this.props.languages.map(l => <Option key={l.value} value={l.value}>{l.key}</Option> ) : [];

        return (
            <Select placeholder={this.props.placeholder}
                    mode="default"
                    showSearch
                    showArrow
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
              {options}
            </Select>
        )
    }
}

export default connect(
    state => ({
        languages: state.apiReducers.languages
    }),
   null
)(LanguageDropDown)

