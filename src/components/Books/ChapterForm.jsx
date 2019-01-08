import React from 'react';
import { Form, Input  } from 'antd';

const FormItem = Form.Item;

class ChapterForm extends React.Component
{
  render() {
    const { getFieldDecorator } = this.props.form;
    const { chapter } = this.props;

    return (<Form layout="vertical">
        <FormItem label="نام">
          {getFieldDecorator('title', {
            rules: [{ required: true, message: 'نام ضروری ہے' }],
            initialValue: chapter.title
          })(
            <Input />
          )}
        </FormItem>
      </Form> );
  }
}

export default ChapterForm;
