import React, { Component } from 'react';
import { connect } from 'react-redux'

import { Select } from 'antd';

const Option = Select.Option;

class LanguageDropDown extends Component {
    render() {
        let options = this.state && this.state.languages ? this.state.languages.map(l => <Option key={l.key} value={l.key}>{l.name}</Option> ) : [];

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

