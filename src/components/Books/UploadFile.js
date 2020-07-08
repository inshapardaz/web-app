import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import ApiService from '../../services/ApiService';
import { CloudUploadOutlined } from '@ant-design/icons';
import { Button, notification, message } from 'antd';

class UploadFile extends Component {
    constructor(props) {
        super(props);
        this.uploadRef = React.createRef();
        this.state = {
            uploading: false
        }
    }

    async uploadFile(files) {
        const { book } = this.props;

        if (book.links.add_file && files && files.length) {
            const hide = message.loading(this.props.intl.formatMessage({ id: 'books.messages.fileUploading'}), 0);
            try {
                this.setState({
                    uploading: true
                });
                await ApiService.upload(book.links.add_file, files[0]);
                notification.success({
                    message: this.props.intl.formatMessage({ id: "books.messages.fileUploaded" }),
                });
                await this.props.onUploaded();

                this.setState({
                    uploading: false
                })
            }
            catch(e){
                console.error(e);
                notification.error({
                    message: this.props.intl.formatMessage({ id: "books.messages.error.saving" }),
                });
                this.setState({
                    uploading: false
                })
            }
            hide();
        }
    }

    onClick = () => this.uploadRef.current.click()

    render() {
        const title = this.props.intl.formatMessage({ id: 'books.action.addFile' });
        return (
            <>
                <Button icon={<CloudUploadOutlined />} block={this.props.block} onClick={this.onClick} disabled={this.state.uploading}>{title}</Button>
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