import React, { Component } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl';
import { TextArea } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class ChapterContentEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contents: '',
            saving : false
        }
    }

    handleChange = (event) => {
        const value = event.target.value;
        this.setState({ contents: value });
        this.props.onChange(value);
    }

    render() {
        return (
            <div style={{ direction: 'rtl' }}>
                <TextArea autoHeight disabled={this.props.saving} value={this.props.contents} onChange={this.handleChange} 
                style={{ width: '100%'}}/>
            </div>
        );
    }
}

    export default injectIntl(ChapterContentEditor);

    ChapterContentEditor.propTypes = {
        contents: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        saving: PropTypes.bool
    };