import React from 'react';
import { withRouter } from 'react-router'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import ApiService from '../../services/api';

import queryString from 'query-string'
import { List, Card, Button, Icon, Modal, Upload } from 'antd';
import Image from '../Image.jsx';
import Page from '../Layout/Page.jsx';
import rel from '../../utils/rel';
import { success, error } from '../../utils/notifications';
import EditAuthor from './EditAuthor';

const { Meta } = Card;
const confirm = Modal.confirm;

class AuthorsHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isError: false,
      isLoading: true,
      showEditor : false,
      selectedAuthor : null,
      authors: { data: [], pageSize: 0, currentPageIndex: 0, totalCount: 0 }
    };
  }
  componentDidMount() {
    const values = queryString.parse(this.props.location.search)
    this.loadAuthors(values.page);
  }

  componentWillReceiveProps(nextProps) {
    const values = queryString.parse(nextProps.location.search)
    if (this.state.page !== values.page)
    {
      this.loadAuthors(values.page);
    }
  }

  onPageChange = (page, pageSize) => {
    this.props.history.push(`/authors?page=${page}`);
  }

  pagerRender(current, type, originalElement) {
    if (type === 'prev') {
      return <a>پِچھلا</a>;
    } if (type === 'next') {
      return <a>اگلا</a>;
    }
    return originalElement;
  }

  reloadAuthors(){
    this.hideEditor();
    this.loadAuthors(this.state.page);
  }

  loadAuthors(page = 1) {
    this.setState({
      isLoading: true,
      page: page
    });

    const api = new ApiService(this.props.user);
    return api.getAuthors(page)
      .then(
        (result) => {
          this.setState({
            isLoading: false,
            isError: false,
            authors: result
          });
        },
        (error) => {
          console.log(error);
          this.setState({
            isLoading: false,
            isError: true
          });
        }
      )
  }

  showDeleteConfirm(author) {
    confirm({
      title: `کیا آپ ${author.name} کو خارج کرنا چاہتے ہیں؟`,
      okText: 'جی ہاں',
      okType: 'danger',
      cancelText: 'نہیں',
      onOk : this.onDelete.bind(this, author)
    });
  }

  onDelete(author){
    const api = new ApiService(this.props.user);
    api.delete(rel(author.links, 'delete'))
      .then(res => {
        success('ادیب کا اخراج', `${author.name} کو خارج کر دیا گیا ہیں؟`);
        this.loadAuthors(this.state.page)
          .then(r => this.hideEditor());
      }, (e) => {
        error('ادیب کا اخراج', `${author.name} کو خارج نہیں کیا جا سکا؟`);
      });
  }

  showNew(){
    this.setState({
      selectedAuthor : {},
      showEditor : true,
      isAdding: true
    })
  }

  showEdit(author){
    this.setState({
      selectedAuthor : author,
      showEditor : true,
      isAdding: false
    })
  }

  hideEditor(){
    this.setState({
      showEditor: false
    })
  }

  uploadImage(author, file){
    const api = new ApiService(this.props.user);
    console.log(file);
    api.upload(rel(author.links, 'image-upload'), file.file)
      .then(res => {
        success('تصویر', `${author.name} کی تصویر محفوظ ہو گئی ہے۔`);
        this.loadAuthors(this.state.page)
          .then(r => this.hideEditor());
      }, (e) => {
        error('تصویر', `${author.name} کی تصویر محفوظ نہیں ہو سکی۔`);
      });
  }


  getActions(author){
    const editLink = rel(author.links, 'update')
    const deleteLink = rel(author.links, 'delete')
    const uploadImageLink = rel(author.links, 'image-upload')

    let actions = [];
    if (deleteLink) {
      actions.push(<Icon type="delete" onClick={() => this.showDeleteConfirm(author)} />)
    }
    if (uploadImageLink){
      const props = {
        customRequest: this.uploadImage.bind(this, author),
        multiple: false,
        showUploadList: false
      };

      actions.push( <Upload {...props}><Icon type="picture" /></Upload>)
    }
    if (editLink) {
      actions.push(<Icon type="edit" onClick={() => this.showEdit(author)} />)
    }

    return actions;
  }

  renderList(isLoading, authors){
    return (<List
      grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 5 }}
      pagination={{
        onChange: this.onPageChange,
        hideOnSinglePage: true,
        current: authors.currentPageIndex,
        pageSize: authors.pageSize,
        total: authors.totalCount,
        itemRender: this.pagerRender
      }}
      loading={isLoading}
      locale= {{ emptyText: 'کوئی مصنّف موجود نہیں'}}
      dataSource={authors.data}
      renderItem={item => (
        <List.Item>
          <Card hoverable
            style={{ width: 240 }}
            cover={<Image source={item} fallback="../../resources/images/avatar1.jpg" />}
            actions={this.getActions(item)}>
            <Meta
              title={<Link to={`/authors/${item.id}`}>{item.name}</Link>}
              description={`${item.bookCount} کتابیں`}
            />
          </Card>
        </List.Item>
      )}
    />)
  }

  renderError() {
    return (
      <div className="error-message">
        <span className="error-message__title">ادیب حاصل کرنے میں ناکامی ہوئی۔</span>
        <Button onClick={this.reloadAuthors.bind(this)} >دوبارہ کوشش کریں</Button>
      </div>
    )
  }

  render() {
    const { authors, isLoading, isError } = this.state;

    const createLink = (authors && authors.links) ? rel(authors.links, 'create') : null;

    return (
      <Page {...this.props} title="مصنّف" isLoading={isLoading} actions={
        createLink && <Button type="primary" onClick={() => this.showNew()}>
          نیا مصنّف <Icon type="plus" />
        </Button>
      }>
        <Helmet title="مصنّف" />
        <div className="author-list">
          { isError ? this.renderError() : this.renderList(isLoading, authors)}
          <EditAuthor author={this.state.selectedAuthor}
                      visible={this.state.showEditor}
                      createNew={this.state.isAdding}
                      createLink={createLink}
                      onCancel={this.hideEditor.bind(this)}
                      onOk={this.reloadAuthors.bind(this)} />
        </div>
      </Page>
    );
  }
}

export default withRouter(connect(
  state => ({
    user: state.oidc.user
  }), null)(AuthorsHome));
