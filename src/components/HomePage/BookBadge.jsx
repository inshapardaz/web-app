import React from 'react';
import PropTypes from "prop-types";

class BookBadge extends React.Component
{
  render(){
    return (<li key={this.props.book.id}>{this.props.book.title}</li>);
  }
}

BookBadge.propTypes = {
  book: PropTypes.object
};

export default BookBadge;
