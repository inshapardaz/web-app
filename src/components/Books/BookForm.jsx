import React from 'react';
import { Form, Input, Switch, Select, AutoComplete  } from 'antd';
import { connect } from 'react-redux';
import ApiService from '../../services/api';

const Option = Select.Option;

const FormItem = Form.Item;
const { TextArea } = Input;

class BookForm extends React.Component
{
  constructor(props){
    super(props);
    this.state = {
      authors: [],
      categories: []
    };
  }

  componentDidMount(){
    const { book } = this.props;
    this.loadCategories();
    this.authorChange(book ? book.authorName : '');
  }

  authorChange(value){
    const api = new ApiService(this.props.user);
    api.searchAuthors(value)
    .then(res => {
      this.setState({
        authors : res.data
      })
    })
  }

  loadCategories(){
    const api = new ApiService(this.props.user);
    api.getCategories()
    .then(res => {
      this.setState({
        categories : res.items
      })
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { book } = this.props;
    const languageOptions = this.props.languages.map(d => <Option key={d.value} value={d.value}>{d.key}</Option>);
    const categoryOptions = this.state.categories.map(d => <Option key={d.id} value={d.id}>{d.name}</Option>);
    const authorOptions = this.state.authors.map(d => <Option key={d.id} value={d.id}>{d.name}</Option>);

    return (<Form layout="vertical">
        <FormItem label="نام">
          {getFieldDecorator('title', {
            rules: [{ required: true, message: 'نام ضروری ہے' }],
            initialValue: book.title
          })(
            <Input />
          )}
        </FormItem>

        {/* <FormItem label="مصنّف">
          {getFieldDecorator('authorId', {
            rules: [{ required: true, message: 'مصنّف ضروری ہے' }],
            initialValue: book.authorId
          })(
            <AutoComplete placeholder="مصنّف کا نام چنیں"
                dataSource={authorOptions}
                onSearch={this.authorChange.bind(this)} />
          )}
        </FormItem> */}

        <FormItem label="تعارف">
          {getFieldDecorator('description', {
            initialValue: book.description
          })(
            <TextArea autosize={{ minRows: 2, maxRows: 6 }} />
          )}
        </FormItem>

        <FormItem label="عوامی کتاب">
          {getFieldDecorator('isPublic', {
            valuePropName: 'checked',
            initialValue: book.isPublic
          })(
            <Switch />
          )}
        </FormItem>

        <FormItem label="زبان">
          {getFieldDecorator('language', {
            rules: [{ required: true, message: 'زبان ضروری ہے' }],
            initialValue: book.language
          })(
            <Select placeholder="زبان چنیں"
                    showSearch
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
              {languageOptions}
            </Select>
          )}
        </FormItem>

        <FormItem label="زمرہ">
          {getFieldDecorator('categories', {
            initialValue: book.categories? book.categories.map(c => c.id) : []
          })(
            <Select placeholder="زمرہ چنیں"
                    mode="multiple"
                    showSearch
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
              {categoryOptions}
            </Select>
          )}
        </FormItem>
      </Form> );
  }
}

export default connect(
  state => ({
    languages: state.apiReducer.languages
  }), null)(BookForm);
