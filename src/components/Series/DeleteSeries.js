import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { Icon, message, Popconfirm } from 'antd';

import ApiService from '../../services/ApiService';

class DeleteSeries extends Component {
    deleteSeries = async () => {
        const { series } = this.props;
        if (!series) return;

        let deleteLink = series.links.delete;
        if (!deleteLink) return;

        const hide = message.loading(this.props.intl.formatMessage({ id: "series.messages.deleting" }, { name: series.name }), 0);

        try {
            await ApiService.delete(deleteLink);
            hide();
            message.success(this.props.intl.formatMessage({ id: "series.messages.deleted" }));
            await this.props.onDeleted();
        }
        catch (e) {
            console.error(e);
            hide();
            message.error(this.props.intl.formatMessage({ id: "series.messages.error.delete" }));
        }
    }

    render() {
        const { series } = this.props;
        const actionYes = this.props.intl.formatMessage({ id: 'action.delete' });
        const actionNo = this.props.intl.formatMessage({ id: 'action.no' });
        const message = this.props.intl.formatMessage({ id: 'series.action.confirmDelete' }, { name: series.name });
        return (
            <Popconfirm title={message} onConfirm={this.deleteSeries} okText={actionYes} cancelText={actionNo}
                icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}>
                <Icon type="delete" />
            </Popconfirm>
        );
    }
}


export default injectIntl(DeleteSeries);

DeleteSeries.propTypes = {
    onDeleted: PropTypes.func,
    series: PropTypes.object.isRequired
};