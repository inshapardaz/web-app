import React, { Component } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router";
import { ErrorPlaceholder, Loading } from '../Common';
import ApiService from '../../services/ApiService';
import ChapterList from '../Chapter/ChapterList';
import EditBook from './EditBook';
import UploadBookImage from './UploadBookImage';
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
      actions.push(<a key="edit" className="btn btn-sm btn-light" onClick={this.onEdit} href="javascript:void(0);"><FormattedMessage id="action.edit" /></a>)
    }

    if (book.links.image_upload) {
      actions.push(<UploadBookImage as="a" key="image" fluid icon="picture" uploadLink={book.links.image_upload}
        content={<FormattedMessage id="action.changeImage" />} onUpdated={this.reloadBook} />)
    }

    if (book.links.delete) {
      actions.push(<DeleteBook as="a" key="delete" fluid onDeleted={this.onDeleted} icon="delete" book={book}
        content={<FormattedMessage id="action.delete" />} />)
    }

    return (<div className="btn-group">{actions}</div>);
  }

  onEdit = () => this.setState({ showEdit: true });
  onCloseEdit = () => this.setState({ showEdit: false });

  renderEdit(book) {
    if (this.state.showEdit && book) {
      return (<EditBook open={true} book={book}
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
      return <Loading fullWidth={true} />;
    }

    if (isError) {
      return this.renderLoadingError();
    }

    if (!book) {
      return null;
    }

    var availability = (<em className="text-muted">{book.isPublic ?
      <><i className="fa fa-globe" /> <FormattedMessage id="book.public" /></> :
      <><i className="fa fa-lock" /> <FormattedMessage id="book.private" /></>}</em>);
    return (
      <>
        <main id="main-container">
          <div className="content">
            <div className="block">
              <div className="block-content">
                <div className="row items-push">
                  <div className="col-md-4 col-lg-5 text-right">
                    <img src={book.links.image || '/resources/img/book_placeholder.png'} alt="image description" />
                  </div>
                  <div className="col-md-8 col-lg-7">
                    <h4 className="h3 mb-1"><span className="text-primary-dark">{book.title}</span></h4>
                    <div className="font-size-sm mb-3">
                      <Link to={`/authors/${book.authorId}`}>{book.authorName}</Link>
                    </div>
                    <div className="font-size-sm mb-3">{availability}</div>
                    <p className="font-size-sm">
                      {book.description}
                    </p>
                    {this.renderBookActions(book)}
                  </div>
                </div>
              </div>
            </div>
            <ChapterList book={book} />
          </div>
        </main>
        {this.renderEdit(book)}
      </>
    )
  }
}

export default withRouter(injectIntl(BookPage))
