import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Button, Card, Icon, Image, Confirm, Label, Dimmer, Header } from 'semantic-ui-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { success, error } from '../../services/toasts';
import ApiService from '../../services/ApiService';
import BookEditor from './BookEditor';

class BookCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDelete: false,
      showEdit : false,
      active : false
    };

    this.uploadRef = React.createRef();
    this.renderEditor = this.renderEditor.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onCloseEdit = this.onCloseEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.deleteBook = this.deleteBook.bind(this);
  }

  async uploadImage(files) {
    const { book } = this.props;
    if (book.links.image_upload && files && files.length) {
      try {
        await ApiService.upload(book.links.image_upload, files[0]);
        this.props.onUpdated();
      }
      catch (e){
        console.error('e', e)
        error(this.props.intl.formatMessage({ id: "books.messages.error.saving" }));
      }
    }
  }

  onEdit = () => this.setState({showEdit: true})
  onCloseEdit = () => this.setState({showEdit: false})
  onDelete = () => this.setState({ confirmDelete: true })

  renderDelete() {
    const { confirmDelete } = this.state;
    const { book } = this.props;

    if (confirmDelete && book) {
      const { intl } = this.props;

      return (<Confirm size="mini" open={confirmDelete}
        content={intl.formatMessage({ id: 'books.action.confirmDelete' }, { title: book.title })}
        cancelButton={intl.formatMessage({ id: 'action.no' })}
        confirmButton={intl.formatMessage({ id: 'action.yes' })}
        onCancel={() => this.setState({ confirmDelete: false })}
        onConfirm={this.deleteBook} closeIcon />);
    }

    return null;
  }

  async deleteBook() {
    const { book } = this.props;
    if (!book) return;

    let deleteLink = book.links.delete;
    if (!deleteLink) return;

    this.setState({
      confirmDelete: false
    });

    try {
      await ApiService.delete(deleteLink);
      success(this.props.intl.formatMessage({ id: "books.messages.deleted" }));
      this.props.onUpdated();
    }
    catch{
      error(this.props.intl.formatMessage({ id: "books.messages.error.delete" }));
    }
  }

  renderBookActions(book) {
    let actions = [];

    if (book.links.update) {
      actions.push(<Button key="edit" color="green" onClick={this.onEdit} inverted icon="pencil"></Button>)
    }

    if (book.links.image_upload) {
      actions.push(<Button key="image" color="olive" onClick={() => this.uploadRef.current.click()} inverted icon="picture">
      </Button>)
    }

    if (book.links.delete) {
      actions.push(<Button key="delete" onClick={this.onDelete} inverted color="red" icon="delete"></Button>)
    }

    return actions;
  }

  renderEditor(book){
    if (this.state.showEdit && book) {
        return (<BookEditor open={true} book={book}
            authorId={book.authorId}
            createLink={null} isAdding={false}
            onOk={this.props.onUpdated}
            onClose={this.onCloseEdit} />);
    }

    return null;
  }

  handleShow = () => this.setState({ active: true })
  handleHide = () => this.setState({ active: false })

  render() {
    const { book } = this.props;
    const { active } = this.state;

    if (book == null) {
      return
    }

    const content = (
      <div>
        <Header as="span" className="book-description" inverted >
          {book.description.trunc(200)}
        </Header>

        <Button inverted as={Link} primary to={`/books/${book.id}`}><FormattedMessage id="action.view" /></Button>
        <Button.Group icons={true} buttons={this.renderBookActions(book)} />
      </div>
    )

    return (
      <>
        <Card >
          <Dimmer.Dimmable 
            blurring
            as={Image}
            dimmed={active}
            dimmer={{ active, content }}
            onMouseEnter={this.handleShow}
            onMouseLeave={this.handleHide}
            height="600px"
            src={book.links.image || '/resources/img/book_placeholder.png'}
          />
          <Card.Content >
            <Card.Header >
            <Link to={`/books/${book.id}`} >{book.title}</Link>
            </Card.Header>
            <Card.Meta>
              <Link to={`/authors/${book.authorId}`} >{book.authorName}</Link>
            </Card.Meta>
          </Card.Content>
          <Card.Content extra>
            {book.categories.map(c => (
              <Label key={c.id} size="tiny">
                <Link to={`/books?category=${c.id}`}>{c.name}</Link>
              </Label>
            ))}
            </Card.Content>
        </Card>
        {this.renderEditor(book)}
        {this.renderDelete()}
        <input type="file" ref={this.uploadRef} style={{ display: "none" }} onChange={(e) => this.uploadImage(e.target.files)} />
      </>
    )
  }
}


export default injectIntl(BookCard);