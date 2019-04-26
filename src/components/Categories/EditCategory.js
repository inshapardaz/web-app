import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { Icon, Alert, Modal, Input, Form, Button, notification } from 'antd';

import ApiService from '../../services/ApiService';

const CategoryForm = Form.create({
    name: 'categoryEditor',
    mapPropsToFields(props) {
        return {
            name: Form.createFormField({
                ...props.name,
                value: props.name || '',
            })
        };
    }
})(
    class extends React.Component {
        render() {
            const { visible, title, onCancel, onOK, isError, isBusy, form, intl } = this.props;
            const { getFieldDecorator } = form;

            return (
                <Modal
                    title={title}
                    visible={visible}
                    onOk={onOK}
                    confirmLoading={isBusy}
                    onCancel={onCancel}
                    closeIcon={!isBusy}
                    closeOnEscape={true}
                    maskClosable={false}>
                    <Form layout="vertical">
                        <Form.Item label={intl.formatMessage({ id: "category.editor.fields.name.title" })} >
                            {getFieldDecorator('name', {
                                rules: [{
                                    required: true, message: intl.formatMessage({ id: 'category.editor.fields.name.error' }),
                                }],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                    </Form>
                    {isError ? <Alert message={intl.formatMessage({ id: 'categories.messages.error.saving' })} type="error" showIcon /> : null}
                </Modal>
            );
        }
    }
);


class EditCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            isBusy: false,
            isError: false
        };
    }

    onOpen = () => {
        this.setState({ visible: true });
    }

    onClose = () => {
        if (this.formRef) {
            const form = this.formRef.props.form;
            form.resetFields();
        }
        this.setState({ visible: false, isError: false });
    }
    
    onSave = async () => {
        const form = this.formRef.props.form;

        await form.validateFields(async (err, values) => {
            if (err) {
                return;
            }

            await this.save(values);
        });
    }

    async save(values) {
        this.setState({
            isBusy: true,
            isError: false
        });

        let { createLink, category, isAdding } = this.props;

        try {

            if (isAdding && category == null){
                category = { name: '' }
            } 

            category.name = values.name;    

            if (isAdding) {
                await ApiService.post(createLink, category);
            } else {
                await ApiService.put(category.links.update, category);
            }

            notification.success({
                message: this.props.intl.formatMessage({ id: "categories.messages.saved" }),
            });

            this.props.onUpdated();
        }
        catch(e){
            console.error(e)
            this.setState({
                isError: true
            });
        }
        finally {
            this.setState({
                isBusy: false
            });
        }
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    render() {
        const { isAdding, intl, category, button } = this.props;
        const { isBusy, isError, visible } = this.state;

        let title = intl.formatMessage({ id: "category.editor.header.edit" }, { name: name });
        let buttonText = intl.formatMessage({ id : "action.edit"});
        let icon = "edit";
        if (isAdding) {
            title = intl.formatMessage({ id: "category.editor.header.add" });
            buttonText = intl.formatMessage({ id : "categories.action.create"});
            icon = "plus";
        }

        const action = button ? 
         <Button icon={icon} onClick={this.onOpen} >{buttonText}</Button> : 
         <Icon type={icon} onClick={this.onOpen} />;

        return (
            <>
                {action}
                <CategoryForm {...category}
                    wrappedComponentRef={this.saveFormRef}
                    visible={visible}
                    title={title}
                    isBusy={isBusy}
                    isError={isError}
                    onCancel={this.onClose}
                    onOK={this.onSave}
                    intl={intl}
                />
            </>
        )
    }
}


export default injectIntl(EditCategory);

EditCategory.propTypes = {
    onUpdated: PropTypes.func,
    category: PropTypes.object 
};