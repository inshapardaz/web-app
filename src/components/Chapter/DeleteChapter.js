import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { Modal, Icon, Alert, notification } from 'antd';

import ApiService from '../../services/ApiService';

class DeleteChapter extends Component {
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
    async deleteChapter() {
        const { chapter } = this.props;
        if (!chapter) return;

        let deleteLink = chapter.links.delete;
        if (!deleteLink) return;

        this.setState({
            isBusy: true,
            isError: false
        });

        try {
            await ApiService.delete(deleteLink);
            notification.success({
                message: this.props.intl.formatMessage({ id: "chapters.messages.deleted" }),
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
        const { chapter } = this.props;
        const { show, isBusy, isError } = this.state;
        const action = this.props.intl.formatMessage({ id: 'action.delete' });
        const message = this.props.intl.formatMessage({ id: 'chapters.action.confirmDelete' }, { title: chapter.title });
        return <>
            <Icon type="delete" onClick={this.onShow} />
            <Modal
                title={action}
                visible={show}
                onOk={this.deleteChapter.bind(this)}
                confirmLoading={isBusy}
                onCancel={this.onClose}
                closable={!isBusy}
                maskClosable={!isBusy}
            >
                <p>{message}</p>
                { isError ? <Alert message={this.props.intl.formatMessage({ id: 'chapters.messages.error.delete' })} type="error" showIcon/> : null }
            </Modal>
        </>
    }
}


export default injectIntl(DeleteChapter);

DeleteChapter.propTypes = {
    onDeleted: PropTypes.func,
    chapter: PropTypes.object.isRequired 
};