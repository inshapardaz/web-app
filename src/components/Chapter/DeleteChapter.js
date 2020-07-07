import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { message, Popconfirm } from 'antd';
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import ApiService from '../../services/ApiService';

class DeleteChapter extends Component {
    deleteChapter = async () => {
        const { chapter } = this.props;
        if (!chapter) return;

        let deleteLink = chapter.links.delete;
        if (!deleteLink) return;

        const hide = message.loading(this.props.intl.formatMessage({ id: "chapters.messages.deleting" },{ title: chapter.title } ), 0);

        try {
            await ApiService.delete(deleteLink);
            hide();
            message.success(this.props.intl.formatMessage({ id: "chapters.messages.deleted" }));
            await this.props.onDeleted();
        }
        catch (e){
            console.error(e);
            hide();
            message.error(this.props.intl.formatMessage({ id: "chapters.messages.error.delete" }));   
        }
    }

    render() {
        const { chapter } = this.props;
        const actionYes = this.props.intl.formatMessage({ id: 'action.delete' });
        const actionNo = this.props.intl.formatMessage({ id: 'action.no' });
        const message = this.props.intl.formatMessage({ id: 'chapters.action.confirmDelete' }, { title: chapter.title });
        return (
            <Popconfirm title={message} onConfirm={this.deleteChapter} okText={actionYes} cancelText={actionNo}
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
                <DeleteOutlined />
            </Popconfirm>
        );
    }
}


export default injectIntl(DeleteChapter);

DeleteChapter.propTypes = {
    onDeleted: PropTypes.func,
    chapter: PropTypes.object.isRequired 
};