import React, { Component } from 'react'
import BookList from './BookList';

export default class BooksHome extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BookList />
    );
  }
}
