import React, { Component } from 'react';
import { connect } from 'react-redux'

import { Select } from 'antd';
import LocaleService from '../services/LocaleService';

const Option = Select.Option;

class LanguageDropDown extends Component {
    static getDerivedStateFromProps(nextProps) {
        if ('value' in nextProps) {
            return {
                ...(nextProps.value || 0),
            };
        }
        return null;
    }

    constructor(props) {
        super(props);

        this.state = {
            value : props.value || 0,
        };
    }

    handleChange = (value) => {
        if (!('value' in this.props)) {
            this.setState({ value });
        }
        this.triggerChange(value);
    }

    triggerChange = (changedValue) => {
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(changedValue);
        }
    }

    render() {
        let options = LocaleService.getLanguages().map(l => <Option key={l.key} value={l.key}>{l.value}</Option>);

        return (
            <Select placeholder={this.props.placeholder}
                mode="default"
                showSearch
                showArrow
                value={this.state.value}
                onChange={this.handleChange}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                {options}
            </Select>
        )
    }
}

export default LanguageDropDown;

