import React from 'react';
import { Form, Input } from 'antd';

const FormItem = Form.Item;

export default class AuthorForm extends React.Component
{
  normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { author } = this.props;

    return (<Form layout="vertical">
        <FormItem label="نام">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'نام ضروری ہے' }],
            initialValue: author.name
          })(
            <Input />
          )}
        </FormItem>
      </Form> );
  }
}
