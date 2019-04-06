import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Button, Image, Label, Dimmer, Header, Icon } from 'semantic-ui-react';
import { Card, Badge } from 'react-bootstrap';
import { injectIntl, FormattedMessage } from 'react-intl';
import BookEditor from './BookEditor';
import ChangeImage from './ChangeImage';
import DeleteBook from './DeleteBook';

class BookCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEdit: false,
      active: false
    };

    this.renderEditor = this.renderEditor.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onCloseEdit = this.onCloseEdit.bind(this);
  }

  onEdit = () => this.setState({ showEdit: true })
  onCloseEdit = () => this.setState({ showEdit: false })

  renderBookActions(book) {
    let actions = [];

    if (book.links.update) {
      actions.push(<Card.Link key="edit" onClick={this.onEdit} >
        <Icon name="pencil" color="green" />
      </Card.Link>)
    }

    if (book.links.image_upload) {
      actions.push(<ChangeImage key="image" inverted color="olive" icon="picture" uploadLink={book.links.image_upload}
      onUpdated={this.props.onUpdated} />)
    }

    if (book.links.delete) {
      actions.push(<DeleteBook key="delete" inverted color="red" icon="delete" book={book} onDeleted={this.props.onUpdated} />)
    }

    if (actions.length > 0) {
      return (<Card.Footer>
        {actions}
      </Card.Footer>);
    }

    return null;
  }

  renderEditor(book) {
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

    return (<>
      <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src={book.links.image || '/resources/img/book_placeholder.png'} onError={(e) => e.target.src='/resources/img/book_placeholder.png'} />
        <Card.Body>
          <Card.Title> <Link to={`/books/${book.id}`} >{book.title}</Link></Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            <Link to={`/authors/${book.authorId}`} >{book.authorName}</Link>
          </Card.Subtitle>
            {book.seriesId && book.seriesName ? (
              <Card.Text>
                <Badge as={Link} to={`/books?series=${book.seriesId}`}>
                  <Icon name="chain" />
                  {book.seriesName}{`${book.seriesIndex}`})
                </Badge>
              </Card.Text>) : null
            }
        </Card.Body>
        {this.renderBookActions(book)}
      </Card>
      {this.renderEditor(book)}
    </>);
  }
}


export default injectIntl(BookCard);