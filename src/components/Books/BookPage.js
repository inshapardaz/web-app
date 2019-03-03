import React, { Component } from 'react'
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { Image, Header, Container, Grid } from 'semantic-ui-react';
import { ErrorPlaceholder, Loading } from '../Common';
import ApiService from '../../services/ApiService';
import ChapterList from '../Chapter/ChapterList';

class BookPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookId: null,
      book: null
    }
  }

  async componentDidMount() {
    const {
      match: { params },
    } = this.props;

    await this.loadBook(params.id);
  }

  async componentWillReceiveProps(nextProps) {
    const { match: { params } } = nextProps

    if (this.state.bookId != params.id) {
      await this.loadBook(params.id);
    }
  }

  reloadBook = async () => await this.loadBook(this.state.bookId);

  async loadBook(bookId) {
    this.setState({
      isLoading: true,
      bookId: bookId
    });

    try {
      let result = await ApiService.getBook(bookId);
      this.setState({
        isLoading: false,
        isError: false,
        book: result
      });
    }
    catch (e) {
      console.log('exception', e)
      this.setState({
        isLoading: false,
        isError: true
      });
    }
  }

  renderLoadingError() {
    const { intl } = this.props;
    const message = intl.formatMessage({ id: 'book.messages.error.loading' });
    const buttonText = intl.formatMessage({ id: 'action.retry' });
    return (<ErrorPlaceholder message={message}
      showButton={true} buttonText={buttonText}
      buttonAction={this.reloadBook.bind(this)} />)
  }

  render() {
    const { book, isLoading, isError } = this.state;

    if (isLoading) {
      return <Loading />;
    }

    if (isError) {
      return this.renderLoadingError();
    }

    if (!book) {
      return null;
    }
    return (
      <>
        <Grid stackable columns={2}>
          <Grid.Column width={4}>
            <Image size="medium" centered src={book.links.image || '/resources/img/book_placeholder.png'} />
            <Header as='h2' textAlign='center'>
              <Header.Content>{book.title}</Header.Content>
              <Header.Subheader as={Link} to={`/authors/${book.authorId}`} >{book.authorName}</Header.Subheader>
            </Header>
            <Container content={book.description} textAlign="center" />
          </Grid.Column>
          <Grid.Column width={9}>
            <ChapterList book={book} />
          </Grid.Column>
        </Grid>
      </>
    )
  }
}

export default injectIntl(BookPage)