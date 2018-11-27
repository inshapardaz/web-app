import React from 'react';
import { getAuthorBooks } from '../../utils/fetchApi';

import BookCell from '../Books/BookCell.jsx';
import Pager from '../Pager.jsx';
import rel from '../../utils/rel';

class AuthorBookList extends React.Component
{
  componentDidMount()
  {
    this.setState({
      isLoading : true
    });

    getAuthorBooks(rel(this.props.author.links, 'books'))
    .then(
      (result) => {
        this.setState({
          isLoading : false,
          authorBooks: result
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

  pageChange = async(link) =>
  {
    this.setState({
      isLoading : true
    });

    getAuthorBooks(link)
    .then(
      (result) => {
        this.setState({
          isLoading : false,
          authorBooks: result
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
    if (!this.state)
      return null;
    const { isError, isLoading, authorBooks } = this.state;
    if (isError)
    {
      return <h5>Unable to load books</h5>;
    }
    else if (isLoading || !authorBooks)
    {
      return <div>Loading...</div>;
    }
    let bookList = authorBooks.data.map(b => <BookCell key={b.id} book={b}></BookCell>);
    return (<div>
      <ul>
         {bookList}
      </ul>
      <Pager source={authorBooks} onNext={this.pageChange} onPrev={this.pageChange} />
    </div>)
  }
}

export default AuthorBookList;
