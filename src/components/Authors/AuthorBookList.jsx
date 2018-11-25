import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAuthorBooks } from '../../actions/api';

import BookCell from '../Books/BookCell.jsx';
import Pager from '../Pager.jsx';
import rel from '../../utils/rel';

class AuthorBookList extends React.Component
{
  async componentDidMount()
  {
    this.setState({
      isLoading : true
    });

    try
    {
      var author = await this.props.getAuthorBooks(rel(this.props.author.links, 'books'))
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
    this.setState({
      isLoading : true
    });
    try
    {
      const books = await this.props.getAuthorBooks(link)
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

  render()
  {
    if (this.props.isError)
    {
      return <h5>Unable to load books</h5>;
    }
    else if (this.props.isError || !this.props.authorBooks)
    {
      return <div>Loading...</div>;
    }
    let bookList = this.props.authorBooks.data.map(b => <BookCell key={b.id} book={b}></BookCell>);
    return (<div>
      <ul>
         {bookList}
      </ul>
      <Pager source={this.props.authorBooks} onNext={this.pageChange} onPrev={this.pageChange} />
    </div>)
  }
}

export default connect(
  state => ({
    isLoading: state.isLoading,
    isError: state.isError,
    authorBooks: state.apiReducer.authorBooks
  }),
  dispatch =>
    bindActionCreators(
      {
        getAuthorBooks
      },
      dispatch,
    ),
)(AuthorBookList)
