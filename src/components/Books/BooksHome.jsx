import React from 'react';
import {connect} from 'react-redux';
import queryString from 'query-string'
import { Helmet } from 'react-helmet';
import ApiService from '../../services/api';
import Page from '../Layout/Page.jsx';
import BookList from './BooksList.jsx';

class BooksHome extends React.Component
{
  constructor(props){
    super(props);
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
    const values = queryString.parse(props.location.search)
    const page = values.page;
    const category = values.category;
    this.setState({
      isLoading : true
    });
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

  onPageChange = (page) =>
  {
    this.props.history.push(`/books?page=${page}`);
  }

  render(){
    const { isError, isLoading, books } = this.state;
    return (
      <Page {...this.props} title="کتابیں" isLoading={isLoading} isError={isError}>
        <Helmet title="کتابیں" />
        <BookList books={books} />
      </Page>
    );
  }
}

export default connect(
  state => ({
    user: state.oidc.user
}), null)(BooksHome);
