import React from 'react';
import { connect } from 'react-redux';
import { Modal, Form } from 'antd';
import BookForm from './BookForm';
import ApiService from '../../services/api';
import rel from '../../utils/rel';
import { success, error } from '../../utils/notifications';

const WrappedBookForm = Form.create()(BookForm);
class EditBook extends React.Component {
  state = {
    visible: false,
    isSaving: false,
  }

  hideEditor(cancel = true) {
    this.setState({
      isSaving: false,
    });
    this.refs.bookForm.resetFields();
    if (cancel) {
      this.props.onCancel()
    }
    else {
      this.props.onOk();
    }
  }

  handleOk = (e) => {
    e.preventDefault();
    this.refs.bookForm.validateFields((err, values) => {
      if (err)
        return;

      values.categories = values.categories.map(c => { return { id: c };});

      this.setState({
        isSaving: true,
      });

      const api = new ApiService(this.props.user);
      if (this.props.createNew) {
        values.authorId = parseInt(values.authorId);
        values.title = values.title.trim();
        if (values.description) {
          values.description = values.description.trim();
        }
        api.post(this.props.createLink, values)
          .then(res => {
            success('کتاب کا اندراج', `${values.name} کا انداج کر دیا گیا ہیں؟`);
            this.hideEditor(false);
          }, (e) => {
            error('کتاب کا اندراج', `${values.name} کا انداج نہیں کیا جا سکا؟`);
            this.setState({
              isSaving: false,
            });
          });
      }
      else {
        const { book } = this.props;
        book.title = values.title.trim();
        if (book.description) {
          book.description = values.description.trim();
        }

        book.authorId = parseInt(values.authorId);
        book.isPublic = values.isPublic;
        book.language = values.language;
        book.categories = values.categories;
        api.put(rel(book.links, 'update'), book)
          .then(res => {
            success('کتاب کا اندراج', `${book.title} کا انداج کر دیا گیا ہیں؟`);
            this.hideEditor(false);
          }, (e) => {
            error('کتاب کا اندراج', `${book.title} کا انداج نہیں کیا جا سکا؟`);
          });
      }
    });
  }

  handleCancel() {
    this.hideEditor();
  }

  render() {
    const { isSaving } = this.state;
    const { visible, book } = this.props;

    if (!book) {
      return null;
    }

    let title = book && book.title ? `${book.title} کی تدوین ` : `نئی کتاب`;

    return <Modal
      title={title}
      visible={visible}
      okText='محفوظ کریں'
      cancelText="اخراج"
      onOk={this.handleOk.bind(this)}
      confirmLoading={isSaving}
      onCancel={this.handleCancel.bind(this)}
    >
      <WrappedBookForm ref="bookForm" book={book} />
    </Modal>
  }
}

export default connect(
  (state, props) => ({
    user: state.oidc.user
  }), null)(EditBook);
