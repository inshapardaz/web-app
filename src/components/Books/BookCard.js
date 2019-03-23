import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Button, Card, Image, Label, Dimmer, Header, Icon } from 'semantic-ui-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import BookEditor from './BookEditor';
import ChangeImage from './ChangeImage';
import DeleteBook from './DeleteBook';

class BookCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEdit : false,
      active : false
    };

    this.renderEditor = this.renderEditor.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onCloseEdit = this.onCloseEdit.bind(this);
  }

  onEdit = () => this.setState({showEdit: true})
  onCloseEdit = () => this.setState({showEdit: false})
  
  renderBookActions(book) {
    let actions = [];

    if (book.links.update) {
      actions.push(<Button key="edit" color="green" onClick={this.onEdit} inverted icon="pencil"></Button>)
    }

    if (book.links.image_upload) {
      actions.push(<ChangeImage key="image" inverted color="olive" icon="picture" uploadLink={book.links.image_upload}
                    onUpdated={this.props.onUpdated} />)
    }

    if (book.links.delete) {
      //actions.push(<Button key="delete" onClick={this.onDelete} inverted color="red" icon="delete"></Button>)
      actions.push(<DeleteBook key="delete" inverted color="red" icon="delete" book={book} onDeleted={this.props.onUpdated} />)
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
        <Button.Group icon buttons={this.renderBookActions(book)} />
      </div>
    )

    return (
      <>
        <Card>
          <Dimmer.Dimmable 
            blurring
            as={Image}
            dimmed={active}
            dimmer={{ active, content }}
            onMouseEnter={this.handleShow}
            onMouseLeave={this.handleHide}
            height="600px"
            label={book.isPublic ? null : { as: 'a', color: 'red', corner: 'right', icon: 'lock' }}
            src={book.links.image || '/resources/img/book_placeholder.png'}
          />
          <Card.Content>
            <Card.Header >
            <Link to={`/books/${book.id}`} >{book.title}</Link>
            </Card.Header>
            <Card.Meta>
            <Icon name="user"/><Link to={`/authors/${book.authorId}`} >{book.authorName}</Link>
            </Card.Meta>
            { book.seriesId && book.seriesName ? (
              <Card.Meta>
                <Label size="tiny" as={Link} to={`/books?series=${book.seriesId}`}>
                  <Icon name="chain"/>
                  {book.seriesName}
                  <Label.Detail>{book.seriesIndex}</Label.Detail>
                </Label>
              </Card.Meta>) : null
            }
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
      </>
    )
  }
}


export default injectIntl(BookCard);