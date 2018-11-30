import React from 'react';
import queryString from 'query-string'
import { getBooks } from '../../utils/fetchApi'
import Page from '../Layout/Page.jsx';
import './style.scss';
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
    const values = queryString.parse(this.props.location.search)
    this.loadBooks(values.page);
  }

  componentWillReceiveProps(nextProps){
    const values = queryString.parse(nextProps.location.search)
    this.loadBooks(values.page);
  }

  loadBooks(page = 1)
  {
    this.setState({
      isLoading : true
    });

    getBooks(page)
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
      <Page {...this.props} title="Books" isLoading={isLoading} isError={isError}>
        <BookList books={books} />
      </Page>
    );
  }
}

//
export default BooksHome;
