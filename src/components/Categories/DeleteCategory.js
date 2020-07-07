import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { message, Popconfirm } from 'antd';
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import ApiService from '../../services/ApiService';

class DeleteCategory extends Component {   
    deleteCategory = async () => {
        const { category } = this.props;
        if (!category) return;

        let deleteLink = category.links.delete;
        if (!deleteLink) return;
        
        const hide = message.loading(this.props.intl.formatMessage({ id: "categories.messages.deleting" },{ name: category.name } ), 0);

        try {
            await ApiService.delete(deleteLink);
            hide();
            message.success(this.props.intl.formatMessage({ id: "categories.messages.deleted" }));
            await this.props.onDeleted();
        }
        catch (e){
            console.error(e);
            hide();
            message.error(this.props.intl.formatMessage({ id: "categories.messages.error.delete" }));   
        }
    }

    render() {
        const { category } = this.props;
        const actionYes = this.props.intl.formatMessage({ id: 'action.delete' });
        const actionNo = this.props.intl.formatMessage({ id: 'action.no' });
        const message = this.props.intl.formatMessage({ id: 'categories.action.confirmDelete' }, { name: category.name });
        return (
            <Popconfirm title={message} onConfirm={this.deleteCategory} okText={actionYes} cancelText={actionNo}
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
                <DeleteOutlined />
            </Popconfirm>
        );
    }
}


export default injectIntl(DeleteCategory);

DeleteCategory.propTypes = {
    onDeleted: PropTypes.func,
    category: PropTypes.object.isRequired
};