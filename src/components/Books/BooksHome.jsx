import React from 'react';
import {connect} from 'react-redux';
import queryString from 'query-string'
import { Helmet } from 'react-helmet';
import ApiService from '../../services/api';
import Page from '../Layout/Page.jsx';
import BookList from './BooksList.jsx';
import EditBook from './EditBook.jsx';
import rel from '../../utils/rel';
import { success } from '../../utils/notifications';
import { Button, Icon, Modal } from 'antd';
const confirm = Modal.confirm;

class BooksHome extends React.Component
{
  constructor(props){
    super(props);
    this.state = {
      isError: false,
      isLoading: false,
      books: { data:[], pageSize: 0, currentPageIndex: 0, totalCount: 0},
      selectedBook: null,
      showEditor : false,
      isAdding: false
    };
  }
  componentDidMount()
  {
    this.loadBooks(this.props);
  }

  componentWillReceiveProps(nextProps){
    this.loadBooks(nextProps);
  }

  loadBooks(props)
  {
    const values = queryString.parse(props.location.search)
    const page = values.page;
    const category = values.category;

    const api = new ApiService(this.props.user);
    api.getBooks(category, page)
    .then(
      (result) => {
        this.setState({
          isLoading : false,
          books: result
        });
      },
      () => {
        this.setState({
          isLoading: false,
          isError: true
        });
      }
    )
  }

  reloadBooks(){
    this.hideEditor();
    this.loadBooks(this.props);
  }

  onPageChange = (page) =>
  {
    this.props.history.push(`/books?page=${page}`);
  }

  showNew(){
    this.setState({
      selectedBook: {},
      showEditor : true,
      isAdding: true
    });
  }

  showEdit(book){
    this.setState({
      selectedBook: book,
      showEditor : true,
      isAdding: false
    });
  }

  hideEditor(){
    this.setState({
      showEditor: false
    })
  }

  onDelete(book){
    confirm({
      title: `کیا آپ ${book.title} کو خارج کرنا چاہتے ہیں؟`,
      okText: 'جی ہاں',
      okType: 'danger',
      cancelText: 'نہیں',
      onOk : this.deleteBook.bind(this, book)
    });
  }

  deleteBook(book){
    const api = new ApiService(this.props.user);
    api.delete(rel(book.links, 'delete'))
      .then(res => {
        success('ادیب کا اخراج', `${book.title} کو خارج کر دیا گیا ہیں؟`);
        this.reloadBooks();
      }, (e) => {
        error('ادیب کا اخراج', `${book.title} کو خارج نہیں کیا جا سکا؟`);
      });
  }

  render(){
    const { isError, isLoading, books } = this.state;

    const createLink = (books && books.links) ? rel(books.links, 'create') : null;

    return (
      <Page {...this.props} title="کتابیں" isLoading={isLoading} isError={isError} actions={
            createLink && <Button type="primary" onClick={() => this.showNew()}>
              نئی کتاب <Icon type="plus" />
            </Button>
          }>
        <Helmet title="کتابیں" />
        <BookList books={books}
                  onPageChange={this.onPageChange.bind(this)}
                  isLoading={isLoading}
                  isError={isError}
                  reload={this.loadBooks.bind(this, this.props)}
                  onDelete={this.onDelete.bind(this)}
                  onEdit={this.showEdit.bind(this)}/>
        <EditBook book={this.state.selectedBook}
                      visible={this.state.showEditor}
                      createNew={this.state.isAdding}
                      createLink={createLink}
                      onCancel={this.hideEditor.bind(this)}
                      onOk={this.reloadBooks.bind(this)} />
      </Page>
    );
  }
}

export default connect(
  state => ({
    user: state.oidc.user
}), null)(BooksHome);
