import React from 'react';
import { Form, Input } from 'antd';

const FormItem = Form.Item;

export default class CategoryForm extends React.Component
{
  render() {
    const { getFieldDecorator } = this.props.form;
    const { category } = this.props;

    return (<Form layout="vertical">
        <FormItem label="نام">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'نام ضروری ہے' }],
            initialValue: category.name
          })(
            <Input />
          )}
        </FormItem>
      </Form> );
  }
}
