import React from 'react';
import {connect} from 'react-redux';
import { Modal, Form } from 'antd';
import CategoryForm from './CategoryForm.jsx';
import ApiService from '../../services/api';
import rel from '../../utils/rel';
import {success, error } from '../../utils/notifications';

const WrappedCategoryForm = Form.create()(CategoryForm);
class EditCategory extends React.Component {
  state = {
    visible: false,
    saving: false,
  }

  hideEditor(cancel = true){
    this.setState({
      saving: false,
    });
    this.refs.CategoryForm.resetFields();
    if (cancel){
      this.props.onCancel()
    }
    else{
      this.props.onOk();
    }
  }

  handleOk = (e) => {
    e.preventDefault();
    this.refs.CategoryForm.validateFields((err, values) => {
      if (err)
        return;

      this.setState({
        saving: true,
      });

      const api = new ApiService(this.props.user);
      if (this.props.createNew) {
         values.name = values.name.trim();
         api.post(this.props.createLink, values)
           .then(res => {
             success('زمرہ کا اندراج', `${values.name} کا انداج کر دیا گیا ہیں؟`);
             this.hideEditor(false);
           }, (e) => {
             error('زمرہ کا اندراج', `${values.name} کا انداج نہیں کیا جا سکا؟`);
             this.setState({
              saving: false,
            });
           });
       }
      else {
        const { category } = this.props;
        category.name = values.name.trim();
        api.put(rel(category.links, 'update'), category)
          .then(res => {
            success('زمرہ کا اندراج', `${category.name} کا انداج کر دیا گیا ہیں؟`);
            this.hideEditor(false);
          }, (e) => {
            error('زمرہ کا اندراج', `${category.name} کا انداج نہیں کیا جا سکا؟`);
          });
      }
    });
  }

  handleCancel() {
    this.hideEditor();
  }

  render() {
    const { saving } = this.state;
    const { visible, category } = this.props;

    if (!category) {
      return null;
    }

    let title = category && category.name ? `${category.name} کی تدوین ` : `نیا زمرہ`;

    return <Modal
      title={title}
      visible={visible}
      okText='محفوظ کریں'
      cancelText="اخراج"
      onOk={this.handleOk.bind(this)}
      confirmLoading={saving}
      onCancel={this.handleCancel.bind(this)}
    >
      <WrappedCategoryForm ref="CategoryForm" category={category}/>
    </Modal>
  }
}

export default connect(
  (state, props) => ({
    user: state.oidc.user
  }), null)(EditCategory);
