import React from 'react';
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import Image from '../Image.jsx';

class AuthorCell extends React.Component
{
  render(){
    if (this.props.author)
    {
      const author = this.props.author;
      return (
        <li>
          <Image source={author} />
          <Link to={'/authors/' + author.id} >{author.name}</Link>
          <span>{author.bookCount} کتابیں</span>
        </li>
      );
    }

    return null;
  }
}

AuthorCell.propTypes = {
  author : PropTypes.object
}

export default AuthorCell;
