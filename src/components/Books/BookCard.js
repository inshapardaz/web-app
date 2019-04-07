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

  renderCategories(book) {
    if (book.categories.length > 0)
    {
      return(
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

    return (<>
      <div className="col-xs-6 col-sm-6 col-md-4 col-lg-3" key={book.id}>
        <div className="tg-postbook">
          <figure className="tg-featureimg">
            <div className="tg-bookimg">
              <div className="tg-frontcover"><img src={book.links.image || '/resources/img/book_placeholder.png'} alt={book.title} /></div>
              <div className="tg-backcover"><img src={book.links.image || '/resources/img/book_placeholder.png'} alt={book.title} /></div>
            </div>
            <Link className="tg-btnaddtowishlist" to={`/books/${book.id}`} >
                  <i className="icon-file-text2"></i>
                  <FormattedMessage id="action.view" />
            </Link>
          </figure>
          <div className="tg-postbookcontent">
           {this.renderCategories(book)}
           {book.seriesId && book.seriesName ? (
              <div className="tg-themetagbox">
                <span className="tg-themetag">
                  {/* <Link to={`/books?series=${book.seriesId}`}> */}
                    {book.seriesName}{`${book.seriesIndex}`}
                  {/* </Link> */}
                </span>
              </div>) : null
            }
            <div className="tg-booktitle">
              <h3><Link to={`/books/${book.id}`} >{book.title}</Link></h3>
            </div>
            <span className="tg-bookwriter">
              {this.props.intl.formatMessage({ id: 'book.by' })} 
              <Link to={`/authors/${book.authorId}`} >{book.authorName}</Link>
            </span>
            <Link className="tg-btn tg-btnstyletwo" to={`/books/${book.id}`}>
              <i className="fa fa-file-text-o"></i>
              <em>{this.props.intl.formatMessage({ id : 'books.action.read'})}</em>
            </Link>
          </div>
        </div>
      </div>

      {this.renderEditor(book)}
    </>);
  }
}


export default injectIntl(BookCard);