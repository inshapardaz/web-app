import React from 'react';
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';

import Image from '../Image.jsx';

class BookCell extends React.Component
{
  render(){
    console.log('rendering book');
    if (this.props.book)
    {
      const book = this.props.book;
      return (
        <li>
          <Image source={book} />
          <Link to={'/books/' + book.id} >{book.title}</Link>
          <span>By <Link to={'/authors/' + book.authorId}>{book.authorName}</Link></span>
          <span>{book.description}</span>
        </li>
      );
    }

    return null;
  }
}

BookCell.propTypes = {
  book : PropTypes.object
}

export default BookCell;
