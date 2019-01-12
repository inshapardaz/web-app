import React from 'react';
import {connect} from 'react-redux';
import { Modal, Form, Icon } from 'antd';
import AuthorForm from './AuthorForm';
import ApiService from '../../services/api';
import rel from '../../utils/rel';
import {success, error } from '../../utils/notifications';

const WrappedAuthorForm = Form.create()(AuthorForm);
class EditAuthor extends React.Component {
  state = {
    visible: false,
    saving: false,
  }

  hideEditor(cancel = true){
    this.setState({
      saving: false,
    });
    this.refs.authorForm.resetFields();
    if (cancel){
      this.props.onCancel()
    }
    else{
      this.props.onOk();
    }
  }

  handleOk = (e) => {
    e.preventDefault();
    this.refs.authorForm.validateFields((err, values) => {
      if (err)
        return;

      this.setState({
        saving: true,
      });

      const api = new ApiService(this.props.user);
      if (this.props.createNew) {
         api.post(this.props.createLink, values)
           .then(res => {
             success('ادیب کا اندراج', `${values.name} کا انداج کر دیا گیا ہیں؟`);
             this.hideEditor(false);
           }, (e) => {
             error('ادیب کا اندراج', `${values.name} کا انداج نہیں کیا جا سکا؟`);
             this.setState({
              saving: false,
            });
           });
       }
      else {
        const { author } = this.props;
        author.name = values.name;
        api.put(rel(author.links, 'update'), author)
          .then(res => {
            success('ادیب کا اندراج', `${author.name} کا انداج کر دیا گیا ہیں؟`);
            this.hideEditor(false);
          }, (e) => {
            error('ادیب کا اندراج', `${author.name} کا انداج نہیں کیا جا سکا؟`);
          });
      }
    });
  }

  handleCancel() {
    this.hideEditor();
  }

  render() {
    const { saving } = this.state;
    const { visible, author } = this.props;

    if (!author) {
      return null;
    }

    let title = author && author.name ? `${author.name} کی تدوین ` : `نیا ادیب`;

    return <Modal
      title={title}
      visible={visible}
      okText='محفوظ کریں'
      cancelText="اخراج"
      onOk={this.handleOk.bind(this)}
      confirmLoading={saving}
      onCancel={this.handleCancel.bind(this)}
    >
      <WrappedAuthorForm ref="authorForm" author={author}/>
    </Modal>
  }
}

export default connect(
  (state, props) => ({
    user: state.oidc.user
  }), null)(EditAuthor);
