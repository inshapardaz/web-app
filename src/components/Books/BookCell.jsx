import React from 'react';
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';

import Image from '../Image.jsx';

class BookCell extends React.Component
{
  render(){
    const {book} = this.props;

    if (book)
    {
      return (
        <div>
          <Image source={book} />
          <Link to={'/books/' + book.id} >{book.title}</Link>
          <span>By <Link to={'/authors/' + book.authorId}>{book.authorName}</Link></span>
          <span>{book.description}</span>
        </div>
      );
    }

    return null;
  }
}

BookCell.propTypes = {
  book : PropTypes.object
}

export default BookCell;
