import React from 'react';
import { withRouter } from 'react-router'
import { connect } from 'react-redux';
import ApiService from '../../services/api';
import { success, error } from '../../utils/notifications';
import EditBook from './EditBook.jsx';

import { Link } from 'react-router-dom';
import { List, Card, Tag, Icon, Upload, Button, Modal } from 'antd';
import Image from '../Image.jsx';
import IconText from '../IconText.jsx';
import rel from '../../utils/rel';

import DeleteBook from './DeleteBook.jsx';

import './style.scss';

const confirm = Modal.confirm;
const { Meta } = Card;

class BookList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDelete : false,
      showEditor: false,
      isAdding: false,
      selectedBook: null
    }
  }

  pagerRender(current, type, originalElement) {
    if (type === 'prev') {
      return <a>پِچھلا</a>;
    } if (type === 'next') {
      return <a>اگلا</a>;
    }
    return originalElement;
  }

  uploadImage(book, file) {
    const api = new ApiService(this.props.user);
    api.upload(rel(book.links, 'image-upload'), file.file)
      .then(res => {
        success('تصویر', `${book.title} کی تصویر محفوظ ہو گئی ہے۔`);
        this.reloadBook();
      }, (e) => {
        error('تصویر', `${book.title} کی تصویر محفوظ نہیں ہو سکی۔`);
      });
  }

  createNew() {
    this.setState({
      selectedBook: {},
      showEditor: true,
      isAdding: true
    });
  }

  showEdit(book) {
    this.setState({
      selectedBook: book,
      showEditor: true,
      isAdding: false
    });
  }

  hideEditor() {
    this.setState({
      showEditor: false
    })
  }

  showDelete(book){
    this.setState({
      showDelete: true,
      selectedBook: book
    })
  }

  reloadBook() {
    this.hideEditor();
    this.props.reload();
  }

   getBookActions(book) {
    let actions = [
      <IconText type={book.isPublic ? 'global' : 'lock'} />,
      <IconText type="tags" text={book.categories.map(t => <Tag key={t.id} closable={false}>{t.name}</Tag>)} />];

    const editLink = rel(book.links, 'update');
    const deleteLink = rel(book.links, 'delete');
    const uploadImageLink = rel(book.links, 'image-upload');

    if (deleteLink) {
      actions.push(<Icon type="delete" onClick={() => this.showDelete(book)} />)
    }
    if (uploadImageLink) {
      const props = {
        customRequest: this.uploadImage.bind(this, book),
        multiple: false,
        showUploadList: false
      };

      actions.push(<Upload {...props}><Icon type="picture" /></Upload>)
    }
    if (editLink) {
      actions.push(<Icon type="edit" onClick={() => this.showEdit(book)} />)
    }

    return actions;
  }

  renderHeader() {
    if (this.props.createLink) {
      return (<Button type="primary" onClick={this.createNew.bind(this)}>
        نئی کتاب <Icon type="plus" />
      </Button>);
    }
    else {
      return null;
    }
  }

  renderDelete(){
    if (this.state.showDelete){
      return (
        <DeleteBook book={this.state.selectedBook}
          onOk={() => this.reloadBook()}
          onCancel={() => this.setState({showDelete : false})}/>
      );
    }

    return null;
  }

  renderList(props) {
    const { books, onPageChange, isLoading } = props;
    return (
      <div className="book-list">
        <List
          itemLayout="vertical"
          size="large"
          loading={isLoading}
          pagination={{
            hideOnSinglePage: true,
            onChange: onPageChange,
            pageSize: books.pageSize,
            current: books.currentPageIndex,
            total: books.totalCount,
            itemRender: this.pagerRender
          }}
          header={this.renderHeader()}
          locale={{ emptyText: 'کوئی کتاب موجود نہیں' }}
          dataSource={books.data}
          renderItem={book => (
            <List.Item
              extra={<Image source={book} height="168" />}
              actions={this.getBookActions(book)}
            >
              <Meta
                title={<Link to={'/books/' + book.id} >{book.title}</Link>}
                description={<Link to={'/authors/' + book.authorId}>{book.authorName}</Link>}
              />
              {book.description}
            </List.Item>
          )}
        />

       {this.renderDelete()}
        <EditBook book={this.state.selectedBook}
          visible={this.state.showEditor}
          createNew={this.state.isAdding}
          createLink={this.props.createLink}
          onCancel={() => this.hideEditor()}
          onOk={() => this.reloadBook()} />
      </div>
    );
  }

  renderError(props) {
    return (<div className="error-message">
      <span className="error-message__title">کتابیں حاصل کرنے میں ناکامی ہوئی۔</span>
      <Button onClick={props.reload()} >دوبارہ کوشش کریں</Button>
    </div>
    );
  }

  render() {
    if (this.props.isError) {
      return this.renderError(this.props);
    }

    return this.renderList(this.props);
  }
}

export default withRouter(connect(
  state => ({
    user: state.oidc.user
  }), null)(BookList));
