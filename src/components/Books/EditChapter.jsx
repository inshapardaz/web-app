import React from 'react';
import { connect } from 'react-redux';
import { Modal, Form } from 'antd';
import ChapterForm from './ChapterForm.jsx';
import ApiService from '../../services/api';
import rel from '../../utils/rel';
import { success, error } from '../../utils/notifications';

const WrappedChapterForm = Form.create()(ChapterForm);
class EditChapter extends React.Component {
  state = {
    visible: false,
    isSaving: false,
  }

  hideEditor(cancel = true) {
    this.setState({
      isSaving: false,
    });
    this.refs.chapterForm.resetFields();
    if (cancel) {
      this.props.onCancel()
    }
    else {
      this.props.onOk();
    }
  }

  handleOk = (e) => {
    e.preventDefault();
    this.refs.chapterForm.validateFields((err, values) => {
      if (err)
        return;

      this.setState({
        isSaving: true,
      });

      const api = new ApiService(this.props.user);
      if (this.props.createNew) {
        api.post(this.props.createLink, values)
          .then(res => {
            success('مضمون کا اندراج', `${values.title} کا انداج کر دیا گیا ہیں؟`);
            this.hideEditor(false);
          }, (e) => {
            error('مضمون کا اندراج', `${values.title} کا انداج نہیں کیا جا سکا؟`);
            this.setState({
              isSaving: false,
            });
          });
      }
      else {
        const { chapter } = this.props;
        chapter.title = values.title;
        api.put(rel(chapter.links, 'update'), chapter)
          .then(res => {
            success('مضمون کا اندراج', `${chapter.title} کا انداج کر دیا گیا ہیں؟`);
            this.hideEditor(false);
          }, (e) => {
            error('مضمون کا اندراج', `${chapter.title} کا انداج نہیں کیا جا سکا؟`);
          });
      }
    });
  }

  handleCancel() {
    this.hideEditor();
  }

  render() {
    const { isSaving } = this.state;
    const { visible, chapter } = this.props;

    if (!chapter) {
      return null;
    }

    let title = chapter && chapter.title ? `${chapter.title} کی تدوین ` : `نیا مضمون`;

    return <Modal
      title={title}
      visible={visible}
      okText='محفوظ کریں'
      cancelText="اخراج"
      onOk={this.handleOk.bind(this)}
      isSaving={isSaving}
      onCancel={this.handleCancel.bind(this)}
    >
      <WrappedChapterForm ref="chapterForm" chapter={chapter} />
    </Modal>
  }
}

export default connect(
  (state, props) => ({
    user: state.oidc.user
  }), null)(EditChapter);
