import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { Icon, Modal, Form, Button, notification } from 'antd';
import ApiService from '../../services/ApiService';

import BookForm from './BookForm';

const WrappedBookForm = Form.create()(BookForm);
const intToObjectArray = (arr) => arr.map(o => {
    return { id: o };
})

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
        const form = this.refs.bookForm;
        form.resetFields();
        this.setState({ visible: false, isError: false });
    }

    onSave = async () => {
        const form = this.refs.bookForm;

        await form.validateFields(async (err, values) => {
            console.log('values', values)
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
            book.description = values.description;
            book.language = values.language;
            book.authorId = values.authorId;
            book.isPublic = values.isPublic
            book.categories = intToObjectArray(values.categories);
            book.seriesId = values.seriesId;
            book.seriesIndex = values.seriesIndex;
            book.yearPublished = values.yearPublished;
            
            console.log(book);

            if (isAdding) {
                await ApiService.post(createLink, book);
            } else {
                await ApiService.put(book.links.update, book);
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
            <Button icon={icon} block={this.props.block} onClick={this.onOpen} >{buttonText}</Button> :
            <Icon type={icon} onClick={this.onOpen} />;

        return (
            <>
                {action}
                <Modal
                    title={header}
                    visible={visible}
                    okText='محفوظ کریں'
                    cancelText="اخراج"
                    onOk={this.onSave}
                    confirmLoading={isBusy}
                    onCancel={this.onClose}
                    closeOnEscape={true}
                    maskClosable={false}>
                    <WrappedBookForm ref="bookForm" book={book} />
                </Modal>
            </>
        )
    }
}

export default injectIntl(EditBook);

EditBook.propTypes = {
    onUpdated: PropTypes.func,
    book: PropTypes.object,
    block: PropTypes.bool
};