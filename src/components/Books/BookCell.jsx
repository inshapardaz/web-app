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
          <Link to={'/books/' + book.id} ><Image source={book} /></Link>
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
