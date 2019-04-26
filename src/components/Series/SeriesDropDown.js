import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Select } from 'antd';

const Option = Select.Option;

import ApiService from '../../services/ApiService';

class SeriesDropDown extends Component {
    state = {
        series: [],
        loading: false
    }

    async componentDidMount(){
        try {
            this.setState({
                loading: true
            })

            let series = await ApiService.getSeries();
            let options = series.items.map(c => <Option key={c.id} value={c.id}>{c.name}</Option> )
            this.setState({
                series: options,
                loading: false
            })
        }
        catch (e) {
            console.log(e)
        }
    }

    render() {
        return (
            <Select placeholder={this.props.placeholder}
                    mode="multiple"
                    showSearch
                    showArrow
                    loading= {this.state.loading}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
              {this.state.series}
            </Select>
        )
    }
}

export default SeriesDropDown;

SeriesDropDown.propTypes = {
    placeholder: PropTypes.string 
};