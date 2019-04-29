import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import { Form, Input, Switch, Select, AutoComplete, InputNumber } from 'antd';

import ApiService from '../../services/ApiService';

const Option = Select.Option;

const FormItem = Form.Item;
const { TextArea } = Input;

const copyrights = [
  {id : 0, name: 'Copyright'},
  {id : 1, name: 'Copyright With Permission'},
  {id : 2, name: 'Free - Public Domain'},
  {id : 3, name: 'Free - Creative Commons'},
  {id : 4, name: 'Free - GPL'},
  {id : 5, name: 'Free - Others'},
];

class BookForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authors: [],
      categories: [],
      series: []
    };
  }

  async componentDidMount() {
    const { book } = this.props;
    await this.loadCategories();
    await this.loadSeries();
    this.authorChange(book ? book.authorName : '');
  }

  async authorChange(value) {
    await ApiService.searchAuthors(value)
      .then(res => {
        this.setState({
          authors: res.data
        })
      })
  }

  async loadCategories() {
    await ApiService.getCategories()
      .then(res => {
        this.setState({
          categories: res.items
        })
      })
  }

  async loadSeries() {
    await ApiService.getSeries()
      .then(res => {
        this.setState({
          series: res.items
        })
      })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { book, intl } = this.props;
    const languageOptions = this.props.languages.map(d => <Option key={d.value} value={d.value}>{d.key}</Option>);
    const categoryOptions = this.state.categories.map(d => <Option key={d.id} value={d.id}>{d.name}</Option>);
    const seriesOptions = this.state.series.map(d => <Option key={d.id} value={d.id}>{d.name}</Option>);
    const authorOptions = this.state.authors.map(d => ({ value: d.id.toString(), text: d.name }));
    const copyrightsOptions = copyrights.map(d => <Option key={d.id} value={d.id}>{d.name}</Option>);

    return (<Form layout="vertical">
      <FormItem label={intl.formatMessage({ id: "book.editor.fields.name.title" })}>
        {getFieldDecorator('title', {
          rules: [{ required: true, message: intl.formatMessage({ id: 'book.editor.fields.name.error' }) }],
          initialValue: book.title
        })(
          <Input placeholder={intl.formatMessage({ id: "book.editor.fields.name.title" })} />
        )}
      </FormItem>

      <FormItem label={intl.formatMessage({ id: "book.editor.fields.author.title" })}>
        {getFieldDecorator('authorId', {
          rules: [{ required: true, message: intl.formatMessage({ id: 'book.editor.fields.author.error' }) }],
          initialValue: book.authorId ? book.authorId.toString() : ""
        })(
          <AutoComplete placeholder={intl.formatMessage({ id: 'book.editor.fields.author.placeholder' })}
            dataSource={authorOptions}
            onSearch={this.authorChange.bind(this)} />
        )}
      </FormItem>

      <FormItem label={intl.formatMessage({ id: "book.editor.fields.description.title" })}>
        {getFieldDecorator('description', {
          initialValue: book.description
        })(
          <TextArea autosize={{ minRows: 2, maxRows: 6 }} placeholder={intl.formatMessage({ id: "book.editor.fields.description.title" })} />
        )}
      </FormItem>

      <Form.Item
        style={{ marginBottom: 0 }}>
        <FormItem label={intl.formatMessage({ id: "book.editor.fields.public" })}
                  style={{ display: 'inline-block', width: 'calc(25% - 12px)' }}>
          {getFieldDecorator('isPublic', {
            valuePropName: 'checked',
            initialValue: book.isPublic
          })(
            <Switch />
          )}
        </FormItem>
        <Form.Item label={intl.formatMessage({ id: "book.editor.fields.yearPublished.title" })}
                   style={{ display: 'inline-block', width: 'calc(75% - 12px)' }} >
          {getFieldDecorator('yearPublished', {
            initialValue: book.yearPublished
          })(
            <InputNumber min={1800} max={new Date().getFullYear()} />
          )}
        </Form.Item>
      </Form.Item>

      <FormItem label={intl.formatMessage({ id: "book.editor.fields.language.title" })}>
        {getFieldDecorator('language', {
          rules: [{ required: true, message: intl.formatMessage({ id: 'book.editor.fields.language.error' }) }],
          initialValue: book.language
        })(
          <Select placeholder={this.props.intl.formatMessage({ id: 'book.editor.fields.language.placeholder' })}
            showSearch
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {languageOptions}
          </Select>
        )}
      </FormItem>

      <FormItem label={intl.formatMessage({ id: "book.editor.fields.categories.title" })}>
        {getFieldDecorator('categories', {
          initialValue: book.categories ? book.categories.map(c => c.id) : []
        })(
          <Select placeholder={this.props.intl.formatMessage({ id: 'book.editor.fields.categories.placeholder' })}
            mode="multiple"
            showSearch
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {categoryOptions}
          </Select>
        )}
      </FormItem>
      <Form.Item
        label={intl.formatMessage({ id: "book.editor.fields.series.title" })}
        style={{ marginBottom: 0 }}>
        <FormItem style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
          {getFieldDecorator('seriesId', {
            initialValue: book.seriesId
          })(
            <Select placeholder={this.props.intl.formatMessage({ id: 'book.editor.fields.series.placeholder' })}
              mode="single"
              showSearch
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {seriesOptions}
            </Select>
          )}
        </FormItem>
        <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>
          -
        </span>
        <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }} >
          {getFieldDecorator('seriesIndex', {
            initialValue: book.seriesIndex
          })(
            <InputNumber min={1} />
          )}
        </Form.Item>
      </Form.Item>
      <FormItem label={intl.formatMessage({ id: "book.editor.fields.copyrights.title" })}>
        {getFieldDecorator('copyrights', {
          initialValue: book.copyrights
        })(
          <Select placeholder={this.props.intl.formatMessage({ id: 'book.editor.fields.copyrights.placeholder' })}
            mode="single"
            showSearch
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {copyrightsOptions}
          </Select>
        )}
      </FormItem>
    </Form>);
  }
}

export default connect(
  state => ({
    languages: state.apiReducers.languages
  }), null)(injectIntl(BookForm));
