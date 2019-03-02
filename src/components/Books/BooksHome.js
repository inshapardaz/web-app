import React, { Component } from 'react'
import { Header } from 'semantic-ui-react';
import BookList from './BookList';
import queryString from 'query-string';
import ApiService from '../../services/ApiService';
import { FormattedMessage } from 'react-intl';

export default class BooksHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryId: 0,
      authorId: 0,
      author: null,
      category: null
    }
  }

  async componentDidMount() {
    const values = queryString.parse(this.props.location.search);
    if (values.category && values.category > 0) {
      this.setState({ categoryId: values.category });
    }

    if (values.author && values.author > 0) {
      this.setState({ authorId: values.author });
    }

    await this.loadData();
  }

  async componentWillReceiveProps(nextProps) {
    const values = queryString.parse(nextProps.location.search)

    if (this.state.categoryId != values.category) {
      this.setState({ categoryId: values.category });
      await this.loadData();
    }

    if (this.state.authorId != values.author) {
      this.setState({ authorId: values.author });
      await this.loadData();
    }
  }

  async loadData() {
    const { authorId, categoryId } = this.state;
    if (author > 0) {
      var author = await ApiService.getAuthor(authorId);
      this.setState({ author: author });
    }

    if (categoryId > 0) {
      var category = await ApiService.getCategory(categoryId);
      this.setState({ category: category });
    }
  }

  render() {
    const { author, category } = this.state;
    
    let headerContent = <FormattedMessage id="header.books" />;
    let headerIcon = "book"
    if (author) {
      headerContent = author.name;
      headerIcon = 'user'
    }
    else if (category){
      headerContent = category.name;
      headerIcon = 'folder'
    }
    return (
      <>
        <Header as="h2" icon={headerIcon} content={headerContent}>
          
        </Header>
        <BookList />
      </>
    );
  }
}
