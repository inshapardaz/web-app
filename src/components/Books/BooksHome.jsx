import React from 'react';
import { getBooks,getBooksByUrl } from '../../utils/fetchApi'

import BookCell from './BookCell.jsx';
import Pager from '../Pager.jsx';

class BooksHome extends React.Component
{
  constructor(props){
    super(props);
    this.state = {
      isError: false,
      isLoading: false,
      books: []
    };
  }
  componentDidMount()
  {
    getBooks()
    .then(
      (result) => {
        this.setState({
          isLoading : false,
          books: result
        });
      },
      (error) => {
        this.setState({
          isLoading : false,
          isError:true
        });
      }
    )
  }

  pageChange = (link) =>
  {
    getBooksByUrl(link)
    .then(
      (result) => {
        this.setState({
          isLoading : false,
          books: result
        });
      },
      (error) => {
        this.setState({
          isLoading : false,
          isError:true
        });
      }
    )
  }

  render(){
    console.log(books);
    const { isError, isLoading, books } = this.state;
    if (isError)
    {
      return <h5>Unable to load books</h5>;
    }
    else if (isLoading || !books)
    {
      return <div>Loading...</div>;
    }
    else if ( this.props.books)
    {
      let bookList = books.data.map(b => <BookCell key={b.id} book={b}></BookCell>);
      return (
        <div>
          <h2>Books</h2>
          <ul>
            {bookList}
          </ul>
          <Pager source={books} onNext={this.pageChange} onPrev={this.pageChange} />
        </div>
      );
    }
    return null;
  }
}

export default BooksHome;
