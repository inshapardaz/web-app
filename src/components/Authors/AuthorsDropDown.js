import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { AutoComplete } from 'antd';

import ApiService from '../../services/ApiService';

class AuthorsDropDown extends Component {
    state = {
        authors : []
    }

    onSearch = async (value) => {
        try {
            let authors = await ApiService.searchAuthors(value);
            let options = authors.data.map(a => ({ value: a.id.toString(), text: a.name }) )
            this.setState({
                authors: options
            })
        }
        catch (e) {
            console.log(e)
        }
    }

    render() {
        return (
            <AutoComplete placeholder={this.props.placeholder}
                dataSource={this.state.authors}
                onSelect={this.props.onSelect}
                onSearch={this.onSearch} />
        )
    }
}

export default AuthorsDropDown;

AuthorsDropDown.propTypes = {
    placeholder: PropTypes.string,
    onSelect: PropTypes.func
};