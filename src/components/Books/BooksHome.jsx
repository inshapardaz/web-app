import React from 'react';
import {connect} from 'react-redux';
import queryString from 'query-string'
import { Helmet } from 'react-helmet';
import ApiService from '../../services/api';
import Page from '../Layout/Page.jsx';
import BookList from './BooksList.jsx';
import rel from '../../utils/rel';
import { Button, Icon } from 'antd';

class BooksHome extends React.Component
{
  constructor(props){
    super(props);
    this.list = React.createRef();
    this.state = {
      isError: false,
      isLoading: false,
      books: { data:[], pageSize: 0, currentPageIndex: 0, totalCount: 0}
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
    this.setState({
      isLoading : true
    });

    const values = queryString.parse(props.location.search)
    const page = values.page;
    const category = values.category;

    const api = new ApiService(this.props.user);
    api.getBooks(category, page)
    .then(
      (result) => {
        this.setState({
          isLoading : false,
          isError: false,
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

  onNew(){
    console.log(this.list.current)
  }

  reloadBooks(){
    this.loadBooks(this.props);
  }

  onPageChange = (page) =>
  {
    this.props.history.push(`/books?page=${page}`);
  }

  render(){
    const { isError, isLoading, books } = this.state;

    const createLink = (books && books.links) ? rel(books.links, 'create') : null;

    return (
      <Page {...this.props} title="کتابیں" isLoading={isLoading}>
        <Helmet title="کتابیں" />
        <BookList ref={this.list}
                  books={books}
                  createLink={createLink}
                  onPageChange={this.onPageChange.bind(this)}
                  isLoading={isLoading}
                  isError={isError}
                  reload={() => this.reloadBooks()} />
      </Page>
    );
  }
}

export default connect(
  state => ({
    user: state.oidc.user
}), null)(BooksHome);
