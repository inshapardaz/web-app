import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { Icon, Alert, Modal, Input, Form, Button, notification, InputNumber  } from 'antd';

import ApiService from '../../services/ApiService';

const ChapterForm = Form.create({
    name: 'chapterEditor',
    mapPropsToFields(props) {
        return {
            title: Form.createFormField({
                ...props.title,
                value: props.title || '',
            }),
            chapterNumber: Form.createFormField({
                ...props.chapterNumber,
                value: props.chapterNumber || 1,
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
                        <Form.Item label={intl.formatMessage({ id: "chapter.editor.fields.name.title" })} >
                            {getFieldDecorator('title', {
                                rules: [{
                                    required: true, message: intl.formatMessage({ id: 'chapter.editor.fields.name.title' }),
                                }],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label={intl.formatMessage({ id: "chapter.editor.fields.name.title" })} >
                            {getFieldDecorator('chapterNumber', {
                                rules: [{
                                    required: true, message: intl.formatMessage({ id: 'chapter.editor.fields.name.title' }),
                                }],
                            })(
                                <InputNumber min={1} />
                            )}
                        </Form.Item>
                    </Form>
                    {isError ? <Alert message={intl.formatMessage({ id: 'chapters.messages.error.saving' })} type="error" showIcon /> : null}
                </Modal>
            );
        }
    }
);

class EditChapter extends Component {
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
    
    saveFormRef = (formRef) => {
        this.formRef = formRef;
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

        let { createLink, chapter, isAdding } = this.props;

        try {

            if (isAdding && chapter == null){
                chapter = { }
            } 

            chapter.title = values.title;    
            chapter.chapterNumber = values.chapterNumber;

            if (isAdding) {
                await ApiService.post(createLink, chapter);
            } else {
                await ApiService.put(chapter.links.update, chapter);
            }

            notification.success({
                message: this.props.intl.formatMessage({ id: "chapter.messages.saved" }),
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
    
  
    render() {
        const { isAdding, intl, chapter, button } = this.props;
        const { isBusy, isError, visible } = this.state;

        let header = intl.formatMessage({ id: "chapter.editor.header.add" });
        let buttonText = intl.formatMessage({ id : "chapter.action.create"});
        let icon = "plus";

        if (!isAdding && chapter) {
            header = intl.formatMessage({ id: "chapter.editor.header.edit" }, { title: chapter.title });
            buttonText = intl.formatMessage({ id : "action.edit"});
            icon = "edit";
        }

        const action = button ? 
         <Button icon={icon} onClick={this.onOpen} >{buttonText}</Button> : 
         <Icon type={icon} onClick={this.onOpen} />;

        return (
            <>
                {action}
                <ChapterForm {...chapter}
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



export default injectIntl(EditChapter);

EditChapter.propTypes = {
    onUpdated: PropTypes.func,
    chapter: PropTypes.object 
};