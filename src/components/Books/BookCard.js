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
      actions.push(<li key="edit" className="tg-facebook" onClick={this.onEdit}><i className="fa fa-edit"></i></li>)
    }

    if (book.links.image_upload) {
      actions.push(<ChangeImage key="image" uploadLink={book.links.image_upload}
        onUpdated={this.props.onUpdated} />)
    }

    if (book.links.delete) {
      actions.push(<DeleteBook key="delete" book={book} onDeleted={this.props.onUpdated} />)
    }

    if (actions.length > 0) {
      return (<ul className="tg-socialicons">
        {actions}
      </ul>);
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

    if (book == null) {
      return
    }

    return (<>
      <div className="col-xs-6 col-sm-4 col-md-3 col-lg-2">
        <div className="tg-author">
          <figure>
            <Link to={`/books/${book.id}`}>
              <img src={book.links.image || '/resources/img/book_placeholder.png'} alt={book.title} />
            </Link>
          </figure>
          <div className="tg-authorcontent">
            <h2> <Link to={`/books/${book.id}`} >{book.title}</Link></h2>
            <Link to={`/authors/${book.authorId}`} >{book.authorName}</Link>
            {book.seriesId && book.seriesName ? (
              <div class="tg-themetagbox">
                <span class="tg-themetag">
                  <Link to={`/books?series=${book.seriesId}`}>
                    {book.seriesName}{`${book.seriesIndex}`}
                  </Link>
                </span>
              </div>) : null
            }
            {this.renderBookActions(book)}
          </div>
        </div>
      </div>

      {this.renderEditor(book)}
    </>);
  }
}


export default injectIntl(BookCard);