import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { Modal, Icon, Alert, Button,    notification } from 'antd';

import ApiService from '../../services/ApiService';

class DeleteAuthor extends Component {
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
    async deleteAuthor() {
        const { author } = this.props;
        if (!author) return;

        let deleteLink = author.links.delete;
        if (!deleteLink) return;

        this.setState({
            isBusy: true,
            isError: false
        });

        try {
            await ApiService.delete(deleteLink);
            notification.success({
                message: this.props.intl.formatMessage({ id: "authors.messages.deleted" }),
            });

            this.onClose();
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
        const { author, button } = this.props;
        const { show, isBusy, isError } = this.state;
        const title = this.props.intl.formatMessage({ id: 'action.delete' });
        const message = this.props.intl.formatMessage({ id: 'authors.action.confirmDelete' }, { name: author.name });

        const action = button ?
            <Button icon="delete" onClick={this.onShow} >{title}</Button> :
            <Icon type="delete" onClick={this.onShow} />
        return <>
            {action}
            <Modal
                title={title}
                visible={show}
                onOk={this.deleteAuthor.bind(this)}
                confirmLoading={isBusy}
                onCancel={this.onClose}
                closable={!isBusy}
                maskClosable={!isBusy}
            >
                <p>{message}</p>
                { isError ? <Alert message={this.props.intl.formatMessage({ id: 'authors.messages.error.delete' })} type="error" showIcon/> : null }
            </Modal>
        </>
    }
}


export default injectIntl(DeleteAuthor);

DeleteAuthor.propTypes = {
    onDeleted: PropTypes.func,
    author: PropTypes.object.isRequired,
    button: PropTypes.bool
};