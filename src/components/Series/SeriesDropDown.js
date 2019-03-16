import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { Dropdown } from 'semantic-ui-react';
import { addSeries } from '../../actions/dataActions';


const convertSeriesOptions = (series) => 
     series.items.map(obj =>{ 
        var rObj = {};
        rObj["key"] = obj.id;
        rObj["text"] = obj.name;
        rObj["value"] = obj.id;
        return rObj;
     });

class SeriesDropDown extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
    }

    handleChange = (e, { value }) => this.props.onChange(value)
    handleAdd =  async(e, { value }) => {
        const { addSeries, addSeriesLink } = this.props;
        await addSeries(addSeriesLink, value);
    }
    render() {
        const { options, value, placeholder, disabled, error, addSeriesLink } = this.props;
        return (
            <Dropdown
                fluid
                selection
                multiple={false}
                options={options}
                search={true}
                value={value}
                error={error}
                allowAdditions={addSeriesLink!= null}
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
        addSeriesLink : state.apiReducers.series.links.create,
        options: convertSeriesOptions(state.apiReducers.series)
    }),
    dispatch => bindActionCreators({
        addSeries: addSeries
    }, dispatch)
)(SeriesDropDown)

