import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { Modal, Alert, Button, notification } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import ApiService from '../../services/ApiService';
class DeleteBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            isError: false,
            show : false
        }
    }
    onShow = () => {
        this.setState({
            show: true
        });
    }
    onClose = () => {
        if (!this.state.isBusy){
            this.setState({
                show: false
            });
        }
    }

    async deleteBook() {
        const { book } = this.props;
        if (!book) return;

        let deleteLink = book.links.delete;
        if (!deleteLink) return;

        this.setState({
            isBusy: true,
            isError: false
        });

        try {
            await ApiService.delete(deleteLink);
            notification.success({
                message: this.props.intl.formatMessage({ id: "books.messages.deleted" }),
            });

            this.onClose();
            await this.props.onDeleted();
        }
        catch(e){
            console.error(e)
            this.setState({
                isBusy: false,
                isError: true
            });
        }
    }

    render() {
        const { book, button } = this.props;
        const { show, isBusy, isError } = this.state;
        const title = this.props.intl.formatMessage({ id: 'action.delete' });
        const message = this.props.intl.formatMessage({ id: 'books.action.confirmDelete' }, { title: book.title });
        const action = button ?
        <Button icon={<DeleteOutlined/>} block={this.props.block} onClick={this.onShow} >{title}</Button> :
        <DeleteOutlined onClick={this.onShow} />

        return <>
            {action}
            <Modal
                title={title}
                visible={show}
                onOk={this.deleteBook.bind(this)}
                confirmLoading={isBusy}
                onCancel={this.onClose}
                closable={!isBusy}
                maskClosable={!isBusy}
            >
                <p>{message}</p>
                { isError ? <Alert message={this.props.intl.formatMessage({ id: 'books.messages.error.delete' })} type="error" showIcon/> : null }
            </Modal>
        </>
    }
}

export default injectIntl(DeleteBook)

DeleteBook.propTypes = {
    onDeleted: PropTypes.func,
    book: PropTypes.object.isRequired,
    button: PropTypes.bool,
    block: PropTypes.bool
};
