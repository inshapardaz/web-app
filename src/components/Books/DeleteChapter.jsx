import React from 'react';
import {connect} from 'react-redux';
import { Modal } from 'antd';

import ApiService from '../../services/api';
import { success, error } from '../../utils/notifications';

import rel from '../../utils/rel';
const confirm = Modal.confirm;

class DeleteChapter extends React.Component {
  deleteChapter() {
    const {chapter, user, onOk, onCancel} = this.props
    const api = new ApiService(user);
    api.delete(rel(chapter.links, 'delete'))
      .then(res => {
        success('مضمون کا اخراج', `${chapter.title} کو خارج کر دیا گیا ہیں؟`);
        onOk();
      }, (e) => {
        error('مضمون کا اخراج', `${chapter.title} کو خارج نہیں کیا جا سکا؟`);
        onCancel();
      });
  }

  render() {
    const { chapter, onCancel } = this.props;

    if (chapter){
      confirm({
        title: `کیا آپ ${chapter.title} کو خارج کرنا چاہتے ہیں؟`,
        okText: 'جی ہاں',
        okType: 'danger',
        cancelText: 'نہیں',
        onOk: this.deleteChapter.bind(this),
        onCancel: onCancel()
      });
    }

    return null;
  }
}

export default connect(
  (state, props) => ({
    user: state.oidc.user,
    chapter: props.chapter
}), null)(DeleteChapter);
