import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { Icon, Alert, Modal, Input, Form, Switch, Button, notification } from 'antd';


import ApiService from '../../services/ApiService';

import AuthorsDropDown from '../Authors/AuthorsDropDown';
import LanguageDropDown from '../LanguageDropDown';
import CategoriesDropDown from '../Categories/CategoriesDropDown';
import SeriesDropDown from '../Series/SeriesDropDown';

const { TextArea } = Input;

const BookForm = Form.create({
    name: 'bookEditor',
    mapPropsToFields(props) {
        return {
            title: Form.createFormField({
                ...props.title,
                value: props.title || '',
            }),
            description: Form.createFormField({
                ...props.description,
                value: props.description || '',
            }),
            isPublic: Form.createFormField({
                ...props.description,
                value: props.isPublic || false,
            }),
            authorId: Form.createFormField({
                ...props.description,
                value: props.authorId || null,
            }),
            categories: Form.createFormField({
                ...props.description,
                value: props.categories || [],
            }),
            language: Form.createFormField({
                ...props.description,
                value: props.language || null,
            }),
            series: Form.createFormField({
                ...props.description,
                value: props.series || [],
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
                    <Form layout="horizontal">
                        <Form.Item label={intl.formatMessage({ id: "book.editor.fields.name.title" })} >
                            {getFieldDecorator('title', {
                                rules: [{
                                    required: true, message: intl.formatMessage({ id: 'book.editor.fields.name.error' }),
                                }],
                            })(
                                <Input placeholder={intl.formatMessage({ id: "book.editor.fields.name.title" })} />
                            )}
                        </Form.Item>

                        <Form.Item label={intl.formatMessage({ id: "book.editor.fields.author.title" })}>
                            {getFieldDecorator('authorId', {
                                rules: [{
                                    required: true, message: intl.formatMessage({ id: 'book.editor.fields.author.error' })
                                }],
                            })(
                                <AuthorsDropDown placeholder={intl.formatMessage({ id: 'book.editor.fields.author.placeholder' })} />
                            )}
                        </Form.Item>

                        <Form.Item label={intl.formatMessage({ id: "book.editor.fields.description.title" })}>
                            {getFieldDecorator('description', {})(
                                <TextArea autosize={{ minRows: 2, maxRows: 6 }} placeholder={intl.formatMessage({ id: "book.editor.fields.description.title" })}/>
                            )}
                        </Form.Item>

                        <Form.Item label={intl.formatMessage({ id: "book.editor.fields.public" })}>
                            {getFieldDecorator('isPublic', {
                                valuePropName: 'checked'
                            })(
                                <Switch />
                            )}
                        </Form.Item>


                        <Form.Item label={intl.formatMessage({ id: "book.editor.fields.language.title" })}>
                            {getFieldDecorator('language', {
                                rules: [{
                                    required: true, message: intl.formatMessage({ id: 'book.editor.fields.language.error' })
                                }],
                            })(
                                <LanguageDropDown placeholder={this.props.intl.formatMessage({ id: 'book.editor.fields.language.placeholder' })} />
                            )}
                        </Form.Item>

                        <Form.Item label={intl.formatMessage({ id: "book.editor.fields.categories.title" })}>
                            {getFieldDecorator('categories', {})(
                                <CategoriesDropDown placeholder={this.props.intl.formatMessage({ id: 'book.editor.fields.categories.placeholder' })} />
                            )}
                        </Form.Item>

                        <Form.Item label={intl.formatMessage({ id: "book.editor.fields.series.title" })}>
                            {getFieldDecorator('series', {})(
                                <SeriesDropDown placeholder={this.props.intl.formatMessage({ id: 'book.editor.fields.series.placeholder' })} />
                            )}
                        </Form.Item>
                    </Form>
                    {isError ? <Alert message={intl.formatMessage({ id: 'books.messages.error.saving' })} type="error" showIcon /> : null}
                </Modal>
            );
        }
    }
);

class EditBook extends Component {
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

        let { createLink, book, isAdding } = this.props;

        try {

            if (isAdding && book == null) {
                book = {}
            }

            book.title = values.title;

            if (isAdding) {
                await ApiService.post(createLink, book);
            } else {
                await ApiService.put(author.links.update, book);
            }

            notification.success({
                message: this.props.intl.formatMessage({ id: "books.messages.saved" }),
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
        const { isAdding, intl, book, button } = this.props;
        const { isBusy, isError, visible } = this.state;

        let header = intl.formatMessage({ id: "book.editor.header.add" });
        let buttonText = intl.formatMessage({ id: "books.action.create" });
        let icon = "plus";

        if (!isAdding && book) {
            header = intl.formatMessage({ id: "book.editor.header.edit" }, { title: book.title });
            buttonText = intl.formatMessage({ id: "action.edit" });
            icon = "edit";
        }

        const action = button ?
            <Button icon={icon} onClick={this.onOpen} >{buttonText}</Button> :
            <Icon type={icon} onClick={this.onOpen} />;

        return (
            <>
                {action}
                <BookForm {...book}
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

export default injectIntl(EditBook);

EditBook.propTypes = {
    onUpdated: PropTypes.func,
    book: PropTypes.object
};