import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import ApiService from '../../services/ApiService';

import { Modal, Icon, Alert, Button, notification } from 'antd';

class UploadFile extends Component {
    constructor(props) {
        super(props);
        this.uploadRef = React.createRef();
    }

    async uploadFile(files) {
        console.log("uploading file")
        const { book } = this.props;

        if (book.links.add_file && files && files.length) {
            try {
                await ApiService.upload(book.links.add_file, files[0]);
                notification.success({
                    message: this.props.intl.formatMessage({ id: "books.messages.fileUploaded" }),
                });
                await this.props.onUploaded();
            }
            catch(e){
                console.error(e);
                notification.error({
                    message: this.props.intl.formatMessage({ id: "books.messages.error.saving" }),
                });
            }
        }
    }
    onClick = () => this.uploadRef.current.click()

    render() {
        const title = this.props.intl.formatMessage({ id: 'books.action.addFile' });
        return (
            <>
                <Button icon="upload" block={this.props.block} onClick={this.onClick}>{title}</Button>
                <input type="file" ref={this.uploadRef} style={{ display: "none" }} onChange={(e) => this.uploadFile(e.target.files)} />
            </>
        )
    }
}

export default injectIntl(UploadFile)
UploadFile.propTypes = {
    onUploaded: PropTypes.func,
    book: PropTypes.object.isRequired,
    block: PropTypes.bool
};