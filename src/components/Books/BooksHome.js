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
      seriesId: 0,
      author: null,
      category: null,
      series: null
    }
  }

  async componentDidMount() {
    const values = queryString.parse(this.props.location.search);

    if (values.category && values.category > 0) {
      await this.loadData(0, values.category, 0);
    }

    if (values.author && values.author > 0) {
      await this.loadData(values.author, 0, 0);
    }

    if (values.series && values.series > 0) {
      await this.loadData(0, 0, values.series);
    }

    
  }

  async componentWillReceiveProps(nextProps) {
    const values = queryString.parse(nextProps.location.search)

    if (values.category && this.state.categoryId != values.category) {
      await this.loadData(0, values.category, 0);
    }

    if (values.author && this.state.authorId != values.author) {
      await this.loadData(0,0, values.author, 0, 0 );
    }

    if (values.series && this.state.seriesId != values.series) {
      await this.loadData(0,0, values.series );
    }
  }

  async loadData(authorId=0, categoryId=0, seriesId=0) {
    try
    {
      if (author > 0) {
        this.setState({ authorId : authorId })
        var author = await ApiService.getAuthor(authorId);
        this.setState({ author: author });
      }

      if (categoryId > 0) {
        this.setState({ categoryId : categoryId })
        var category = await ApiService.getCategory(categoryId);
        this.setState({ category: category });
      }

      if (seriesId > 0) {
        this.setState({ seriesId : seriesId })
        var series = await ApiService.getSeriesById(seriesId);
        this.setState({ series: series });
      }
    }
    catch(e){
      console.error(e);
    }
  }

  render() {
    const { author, category, series  } = this.state;
    
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
    else if (series){
      headerContent = series.name;
      headerIcon = 'chain'
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
