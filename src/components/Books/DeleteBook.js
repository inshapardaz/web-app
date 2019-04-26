import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { Modal, Icon, Alert, notification } from 'antd';

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
        this.setState({
            show: false
        });
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
            await this.props.onDeleted();
        }
        catch{
            this.setState({
                isBusy: false,
                isError: true
            });
        }
    }

    render() {
        const { book } = this.props;
        const { show, isBusy, isError } = this.state;
        const action = this.props.intl.formatMessage({ id: 'action.delete' });
        const message = this.props.intl.formatMessage({ id: 'books.action.confirmDelete' }, { title: book.title });
        return <>
            <Icon type="delete" onClick={this.onShow} />
            <Modal
                title={action}
                visible={show}
                onOk={this.deleteBook.bind(this)}
                confirmLoading={isBusy}
                onCancel={this.onClose}
                closeIcon={!isBusy}
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
};
