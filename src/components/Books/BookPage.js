import React, { Component } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router";
import { Image, Header, Container, Grid, Label, Button, Segment, Icon } from 'semantic-ui-react';
import { ErrorPlaceholder, Loading } from '../Common';
import ApiService from '../../services/ApiService';
import ChapterList from '../Chapter/ChapterList';
import BookEditor from './BookEditor';
import ChangeImage from './ChangeImage';
import DeleteBook from './DeleteBook';
import { history } from '../../store/configureStore';

class BookPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookId: null,
      book: null,
      confirmDelete: false
    }

    this.reloadBook = this.reloadBook.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDeleted = this.onDeleted.bind(this);
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
      showEdit: false,
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
      console.error(e)
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

  renderBookActions(book) {
    let actions = [];

    if (book.links.update) {
      actions.push(<Button key="edit" fluid onClick={this.onEdit} icon="pencil"
        content={<FormattedMessage id="action.edit" />} />)
    }

    if (book.links.image_upload) {
      actions.push(<ChangeImage key="image" fluid icon="picture" uploadLink={book.links.image_upload}
        content={<FormattedMessage id="action.changeImage" />} onUpdated={this.reloadBook} />)
    }

    if (book.links.delete) {
      actions.push(<DeleteBook key="delete" fluid onDeleted={this.onDeleted} icon="delete" book={book}
        content={<FormattedMessage id="action.delete" />} />)
    }

    return actions;
  }

  onEdit = () => this.setState({ showEdit: true });
  onCloseEdit = () => this.setState({ showEdit: false });

  renderEdit(book) {
    if (this.state.showEdit && book) {
      return (<BookEditor open={true} book={book}
        authorId={book.authorId}
        createLink={null} isAdding={false}
        onOk={this.reloadBook}
        onClose={this.onCloseEdit} />);
    }
  }

  onDeleted = () => history.push(`/books`)

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
            <Container textAlign="center">
              {book.categories.map(c => (
                <Label key={c.id} size="tiny" >
                  <Link to={`/books?category=${c.id}`}>{c.name}</Link>
                </Label>
              ))}
            </Container >

            { book.seriesId && book.seriesName ? (
              <Segment textAlign="center" basic>
                <Label size="tiny" as={Link} to={`/books?series=${book.seriesId}`}>
                  <Icon name="chain"/>
                  {book.seriesName}
                  <Label.Detail>{book.seriesIndex}</Label.Detail>
                </Label>
              </Segment>) : null
            }
            <Segment basic>
              <Container content={book.description} textAlign="center" />
            </Segment>
            <Segment basic>
              <Button.Group vertical labeled icon fluid>
                {this.renderBookActions(book)}
              </Button.Group>
            </Segment>
          </Grid.Column>
          <Grid.Column width={9}>
            <ChapterList book={book} />
          </Grid.Column>
        </Grid>
        {this.renderEdit(book)}
      </>
    )
  }
}

export default withRouter(injectIntl(BookPage))