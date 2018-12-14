import React from 'react';
import { Form, Input } from 'antd';

const FormItem = Form.Item;

export default class AuthorForm extends React.Component
{
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
