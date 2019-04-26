import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { Icon, notification } from 'antd';

import ApiService from '../../services/ApiService';

class UploadAuthorImage extends Component {
    constructor(props) {
        super(props);
        this.uploadRef = React.createRef();
    }

    async uploadImage(files) {
        const { author } = this.props;

        if (author.links.image_upload && files && files.length) {
            try {
                await ApiService.upload(author.links.image_upload, files[0]);
                notification.success({
                    message: this.props.intl.formatMessage({ id: "authors.messages.saved" }),
                });
                await this.props.onUpdated();
            }
            catch{
                notification.success({
                    message: this.props.intl.formatMessage({ id: "authors.messages.error.saving" }),
                });
            }
        }
    }

    render() {
        return <>
            <Icon type="picture" onClick={() => this.uploadRef.current.click()} />
            <input type="file" ref={this.uploadRef} style={{ display: "none" }} onChange={(e) => this.uploadImage(e.target.files)} />
        </>
    }
}


export default injectIntl(UploadAuthorImage);

UploadAuthorImage.propTypes = {
    onUpdated: PropTypes.func,
    author: PropTypes.object.isRequired 
};