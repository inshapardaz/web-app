import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Button, Card, Icon, Image, Confirm, Label } from 'semantic-ui-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { success, error } from '../../services/toasts';
import ApiService from '../../services/ApiService';
import BookEditor from './BookEditor';

class BookCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDelete: false,
      showEdit : false
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
      actions.push(<Button key="edit" onClick={this.onEdit} basic attached="bottom" animated>
        <Button.Content visible><Icon name="pencil" color="green" /></Button.Content>
        <Button.Content hidden><FormattedMessage id="action.edit" /></Button.Content>
      </Button>)
    }

    if (book.links.image_upload) {
      actions.push(<Button key="image" onClick={() => this.uploadRef.current.click()} basic animated attached="bottom">
        <Button.Content visible><Icon name='photo' /></Button.Content>
        <Button.Content hidden><FormattedMessage id="action.changeImage" /></Button.Content>
        <input type="file" ref={this.uploadRef} style={{ display: "none" }} onChange={(e) => this.uploadImage(e.target.files)} />
      </Button>)
    }

    if (book.links.delete) {
      actions.push(<Button key="delete" onClick={this.onDelete} basic animated attached="bottom">
        <Button.Content visible><Icon name="delete" color="red" /> </Button.Content>
        <Button.Content hidden><FormattedMessage id="action.delete" /></Button.Content>
      </Button>)
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

  render() {
    const { book } = this.props;
    if (book == null) {
      return
    }

    return (
      <>
        <Card >
          <Image src={book.links.image || '/resources/img/book_placeholder.png'} height="600px" as={Link} to={`/books/${book.id}`} />
          <Card.Content>
            <Card.Header >
            <Link to={`/books/${book.id}`} >{book.title}</Link>
            </Card.Header>
            <Card.Meta>
              <Link to={`/authors/${book.authorId}`} >{book.authorName}</Link>
            </Card.Meta>
            <Card.Meta>
            {book.categories.map(c => (
              <Label key={c.id} size="tiny">
                <Link to={`/books?category=${c.id}`}>{c.name}</Link>
              </Label>
            ))}
            </Card.Meta>
            <Card.Description>
              {book.description}
            </Card.Description>
          </Card.Content>
          <div className="ui bottom attached basic buttons">
            {this.renderBookActions(book)}
          </div>
        </Card>
        {this.renderEditor(book)}
        {this.renderDelete()}
      </>
    )
  }
}


export default injectIntl(BookCard);