import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Button, Link } from 'antd';
import { injectIntl } from 'react-intl';

class DownloadFile extends Component {
    render() {
        const title = this.props.intl.formatMessage({ id: 'action.download' });

        let icon = "file";
        if (this.props.file.mimeType == "application/pdf")
        {
            icon = "file-pdf";
        }

        console.dir(this.props.file);
        return (
            <Button href={this.props.file.links.download} target="_blank" type="link" icon={icon} block={this.props.block} >{title}</Button>
        )
    }
}

export default injectIntl(DownloadFile)
DownloadFile.propTypes = {
    file: PropTypes.object.isRequired,
    block: PropTypes.bool
};