import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { Icon, Alert, Modal, Input, Form, Button, notification } from 'antd';


import ApiService from '../../services/ApiService';

const AuthorForm = Form.create({
    name: 'authorEditor',
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
            const { visible, header, onCancel, onOK, isError, isBusy, form, intl } = this.props;
            const { getFieldDecorator } = form;

            return (
                <Modal
                    title={header}
                    visible={visible}
                    onOk={onOK}
                    confirmLoading={isBusy}
                    onCancel={onCancel}
                    closeIcon={!isBusy}
                    closeOnEscape={true}
                    maskClosable={false}>
                    <Form layout="vertical">
                        <Form.Item label={intl.formatMessage({ id: "author.editor.fields.name.title" })} >
                            {getFieldDecorator('name', {
                                rules: [{
                                    required: true, message: intl.formatMessage({ id: 'author.editor.fields.name.error' }),
                                }],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                    </Form>
                    {isError ? <Alert message={intl.formatMessage({ id: 'authors.messages.error.saving' })} type="error" showIcon /> : null}
                </Modal>
            );
        }
    }
);

class EditAuthor extends Component {
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

        let { createLink, author, isAdding } = this.props;

        try {

            if (isAdding && author == null) {
                author = { name: '' }
            }

            author.name = values.name;

            if (isAdding) {
                await ApiService.post(createLink, author);
            } else {
                await ApiService.put(author.links.update, author);
            }

            notification.success({
                message: this.props.intl.formatMessage({ id: "authors.messages.saved" }),
            });

            this.props.onUpdated();
        }
        catch (e) {
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
        const { isAdding, intl, author, button, block } = this.props;
        const { isBusy, isError, visible } = this.state;
        
        let header = intl.formatMessage({ id: "author.editor.header.add" });
        let buttonText = intl.formatMessage({ id: "authors.action.create" });
        let icon = "plus";

        if (!isAdding && author) {
            header = intl.formatMessage({ id: "author.editor.header.edit" }, { name: author.name });
            buttonText = intl.formatMessage({ id: "action.edit" });
            icon = "edit";           
        }

        const action = button ?
            <Button icon={icon} block={block} onClick={this.onOpen} >{buttonText}</Button> :
            <Icon type={icon} onClick={this.onOpen} />;

        return (
            <>
                {action}
                <AuthorForm {...author}
                    wrappedComponentRef={this.saveFormRef}
                    visible={visible}
                    header={header}
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


export default injectIntl(EditAuthor);

EditAuthor.propTypes = {
    onUpdated: PropTypes.func,
    author: PropTypes.object,
    button: PropTypes.bool,
    block: PropTypes.bool
};