import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import Editor from "rich-markdown-editor";
import ApiService from '../../services/ApiService';

class ChapterContentEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contents: '',
            saving: false
        }
    }

    handleChange = (event) => {
        const value = event.target.value;
        this.onChangeValue(value);
    }

    onChangeValue = (value) => {
        const val = value();
        this.setState({ contents: val });
        this.props.onChange(val);
    }

    onImageUpload = async (file) => {
        var response = await ApiService.upload(this.props.entry.links.image_upload, file);
        console.log(response.links.self)
        return response.links.self;
    }

    render() {
        return (
            <div className="block">
                <div className="block-content">
                    <div style={{ direction: 'ltr', padding: '0 50px' }}>
                        <Editor readOnly={this.props.saving} autoFocus={true} toc={true} uploadImage={this.onImageUpload.bind(this)}
                            defaultValue={this.props.contents} onChange={this.onChangeValue.bind(this)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default (connect(
    (state) => ({
        entry: state.apiReducers.entry
    }),
    dispatch => bindActionCreators({
    }, dispatch)
)(injectIntl(ChapterContentEditor)));


ChapterContentEditor.propTypes = {
    contents: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    saving: PropTypes.bool
};