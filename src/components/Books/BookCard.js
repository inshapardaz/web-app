import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
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
      actions.push(<button type="button" key="edit" className="btn-block-option" onClick={this.onEdit}><i className="far fa-fw fa-edit"/></button>)
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

  render() {
    const { book } = this.props;

    if (book == null) {
      return
    }

    return (
      <div className="col-md-5 col-lg-4 col-xl-3" key={book.id}>
        <div className="block block-rounded block-link-pop" >
          <div className="block-content block-content-full text-center bg-image" style={{ backgroundImage: `url('${book.links.image || '/resources/img/book_placeholder.png'}')` }} >
            <div className="py-6 mt-6" />
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