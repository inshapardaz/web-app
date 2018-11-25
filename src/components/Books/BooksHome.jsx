import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { getBooks } from '../../actions/api'

import BookCell from './BookCell.jsx';
import Pager from '../Pager.jsx';

class BooksHome extends React.Component
{
  async componentDidMount()
  {
    this.setState({
      isLoading : true
    });
    try
    {
      const books = await this.props.getBooks()
    }
    catch(error)
    {
      this.setState({
        isError : true
      });
    }

    this.setState({
      isLoading : false
    });
  }

  pageChange = async(link) =>
  {
    console.log(`page changed with link:${link}`);
    this.setState({
      isLoading : true
    });
    try
    {
      const books = await this.props.getBooks(link)
    }
    catch(error)
    {
      this.setState({
        isError : true
      });
    }

    this.setState({
      isLoading : false
    });
  }

  render(){
    if (this.props.isError)
    {
      return <h5>Unable to load books</h5>;
    }
    else if (this.props.isError || !this.props.books)
    {
      return <div>Loading...</div>;
    }
    else if ( this.props.books)
    {
      let bookList = this.props.books.data.map(b => <BookCell key={b.id} book={b}></BookCell>);
      return (
        <div>
          <h2>Books</h2>
          <ul>
            {bookList}
          </ul>
          <Pager source={this.props.books} onNext={this.pageChange} onPrev={this.pageChange} />
        </div>
      );
    }
    return null;
  }
}

export default (withRouter(connect(
  state => ({
    isLoading: state.isLoading,
    isError: state.isLoading,
    books: state.apiReducer.books
  }),
	dispatch => bindActionCreators({
		getBooks: getBooks
	}, dispatch)
)(BooksHome)));
