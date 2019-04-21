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
  onAddToFavorite = (book) => {
    console.log("Added to favorites");
  }

  onRemoveFromFavorite = (book) => {
    console.log("Remove from favorites");
  }

  renderBookActions(book) {
    let actions = [];

    if (book.links.update) {
      actions.push(<button type="button" key="edit" className="btn-block-option" onClick={this.onEdit}><i className="far fa-fw fa-edit"></i></button>)
    }

    if (book.links.image_upload) {
      actions.push(<ChangeImage key="image" uploadLink={book.links.image_upload}
        onUpdated={this.props.onUpdated} />)
    }

    if (book.links.delete) {
      actions.push(<DeleteBook key="delete" book={book} onDeleted={this.props.onUpdated} />)
    }

    if (actions.length > 0) {
      return actions;
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

  renderCategories(book) {
    if (book.categories.length > 0) {
      return (
        <ul className="tg-bookscategories">
          {book.categories.map(c => <li key={c.id}><Link to={`/books?category=${c.id}`} >{c.name}</Link></li>)}
        </ul>
      );
    }

    return null;
  }

  renderHoverAction(book) {
    if (book.links.add_favorites) {
      return (<a href="javascript:void(0);" className="tg-btnaddtowishlist" onClick={this.onAddToFavorite(book)}>
        <i className="icon-heart"></i>
        <FormattedMessage id="books.action.favorite.add" />
      </a>)
    }

    if (book.links.remove_favorites) {
      return (<a href="javascript:void(0);" className="tg-btnaddtowishlist" onClick={this.onRemoveFromFavorite(book)}>
        <i className="icon-heart-broken"></i>
        <FormattedMessage id="books.action.favorite.add" />
      </a>)
    }

    return (<Link className="tg-btnaddtowishlist" to={`/books/${book.id}`} >
      <i className="icon-file-text2"></i>
      <FormattedMessage id="action.view" />
    </Link>);
  }

  render() {
    const { book } = this.props;

    if (book == null) {
      return
    }

    return (
      <div className="col-md-6 col-lg-6 col-xl-4" key={book.id}>
        <div className="block block-rounded block-link-pop" >
          <div className="block-content block-content-full text-center bg-image" style={{ backgroundImage: `url('${book.links.image || '/resources/img/book_placeholder.png'}')` }} >
            <div className="py-8" />
          </div>
          <div className="block-content block-content-full">
            <h4 className="mb-1"><Link to={`/books/${book.id}`} >{book.title}</Link></h4>
            <div className="font-size-sm text-muted">
              {this.props.intl.formatMessage({ id: 'book.by' })}
              <Link to={`/authors/${book.authorId}`} >{book.authorName}</Link></div>
              {this.renderBookActions(book)}
          </div>
        </div>
        {this.renderEditor(book)}
      </div>
    );
  }
}

export default injectIntl(BookCard);