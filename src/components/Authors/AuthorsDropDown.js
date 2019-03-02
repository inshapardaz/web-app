import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import ApiService from '../../services/ApiService';
import { error } from '../../services/toasts';

export default class AuthorsDropDown extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isFetching: false,
            multiple: false,
            search: true,
            searchQuery: '',
            options: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
    }

    componentDidMount(){
        this.fetchOptions();
    }

    handleChange = (e, { value }) => this.props.onChange(value)

    handleSearchChange(e, { searchQuery }) {
        this.setState({ searchQuery });
        this.fetchOptions();
    }

    async fetchOptions() {
        this.setState({ isFetching: true })

        try{
            let authors = await ApiService.searchAuthors(this.state.searchQuery);
            let options = authors.data.map(obj =>{ 
                var rObj = {};
                rObj["key"] = obj.id;
                rObj["text"] = obj.name;
                rObj["value"] = obj.id;
                return rObj;
             });

             this.setState({ isFetching: false, options: options })
        }
        catch{
            error(this.props.intl.formatMessage({ id: "authors.messages.error.loading" }));
        }
    }

    render() {
        const { multiple, options, isFetching, search } = this.state;
        const { value, placeholder, disabled, error } = this.props;
        return (
            <Dropdown
                fluid
                selection
                multiple={multiple}
                search={search}
                options={options}
                value={value}
                error={error}
                placeholder={placeholder}
                onChange={this.handleChange}
                onSearchChange={this.handleSearchChange}
                disabled={isFetching || disabled}
                loading={isFetching}
            />
        )
    }
}
