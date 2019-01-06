import React from 'react';
import {connect} from 'react-redux';
import { Modal } from 'antd';

import ApiService from '../../services/api';
import { success, error } from '../../utils/notifications';

import rel from '../../utils/rel';
const confirm = Modal.confirm;

class DeleteBook extends React.Component {
  deleteBook() {
    const {book, user, onOk, onCancel} = this.props
    const api = new ApiService(user);
    api.delete(rel(book.links, 'delete'))
      .then(res => {
        success('کتاب کا اخراج', `${book.title} کو خارج کر دیا گیا ہیں؟`);
        onOk();
      }, (e) => {
        error('کتاب کا اخراج', `${book.title} کو خارج نہیں کیا جا سکا؟`);
        onCancel();
      });
  }

  render() {
    const { book, onCancel } = this.props;

    console.log(book)
    if (book){
      confirm({
        title: `کیا آپ ${book.title} کو خارج کرنا چاہتے ہیں؟`,
        okText: 'جی ہاں',
        okType: 'danger',
        cancelText: 'نہیں',
        onOk: this.deleteBook.bind(this),
        onCancel: onCancel()
      });
    }

    return null;
  }
}

export default connect(
  (state, props) => ({
    user: state.oidc.user,
    book: props.book
}), null)(DeleteBook);
