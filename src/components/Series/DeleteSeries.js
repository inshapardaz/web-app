import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { Modal, Icon, Alert, notification } from 'antd';

import ApiService from '../../services/ApiService';

class DeleteSeries extends Component {
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
    async deleteSeries() {
        const { series } = this.props;
        if (!series) return;

        let deleteLink = series.links.delete;
        if (!deleteLink) return;

        this.setState({
            isBusy: true,
            isError: false
        });

        try {
            await ApiService.delete(deleteLink);
            notification.success({
                message: this.props.intl.formatMessage({ id: "series.messages.deleted" }),
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
        const { series } = this.props;
        const { show, isBusy, isError } = this.state;
        const action = this.props.intl.formatMessage({ id: 'action.delete' });
        const message = this.props.intl.formatMessage({ id: 'series.action.confirmDelete' }, { name: series.name });
        return <>
            <Icon type="delete" onClick={this.onShow} />
            <Modal
                title={action}
                visible={show}
                onOk={this.deleteSeries.bind(this)}
                confirmLoading={isBusy}
                onCancel={this.onClose}
                closeIcon={!isBusy}
            >
                <p>{message}</p>
                { isError ? <Alert message={this.props.intl.formatMessage({ id: 'series.messages.error.delete' })} type="error" showIcon/> : null }
            </Modal>
        </>
    }
}


export default injectIntl(DeleteSeries);

DeleteSeries.propTypes = {
    onDeleted: PropTypes.func,
    series: PropTypes.object.isRequired 
};