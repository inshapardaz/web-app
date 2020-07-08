import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { injectIntl } from 'react-intl';
import { List, Card, Tag } from 'antd';
import { TagOutlined, LinkOutlined } from '@ant-design/icons';

import EditBook from './EditBook';
import UploadBookImage from './UploadBookImage';
import DeleteBook from './DeleteBook';

const { Meta } = Card;

const defaultBookImage = '/resources/img/book_placeholder.png';

class BookCard extends Component {
  renderBookActions(book) {
    let actions = [];

    if (!book || !book.links) return null;
    const editLink = book.links.update;
    const deleteLink = book.links.delete;
    const imageLink = book.links.image_upload;

    if (editLink) {
      actions.push(<EditBook book={book} onUpdated={this.props.onUpdated} />)
    }

    if (imageLink) {
      actions.push(<UploadBookImage book={book} onUpdated={this.props.onUpdated} />);
    }

    if (deleteLink) {
      actions.push(<DeleteBook book={book} onDeleted={this.props.onUpdated} />);
    }

    if (actions.length > 0) {
      return actions;
    }

    return null;
  }

  renderCategories = (book) => {
    if (book && book.categories && book.categories.length > 0){
      return (<div style={{ padding: '8px 0' }}>
          { book.categories.map(c => <Tag key={c.id}><Link to={`/books?category=${c.id}`}><TagOutlined /> {c.name}</Link></Tag>)}
      </div>);
    }
    return null;
  }

  renderSeries = (book) => {
    if (book && book.seriesName){
      return (
        <div style={{ padding: '8px 0' }}>
          {this.props.intl.formatMessage({ id: 'book.series' }, { index: book.seriesIndex })}
          <Tag style={{ marginLeft: '4px' }}>
            <LinkOutlined />
            <Link to={`/books?series=${book.seriesId}`}>{book.seriesName}</Link>
          </Tag>
        </div>);
    }

    return null;
  }

  setDefaultBookImage(ev) {
    ev.target.src = defaultBookImage;
  }

  render() {
    const { book, card } = this.props;
    if (book == null) {
      return
    }

    const title = <Link to={`/books/${book.id}`} >{book.title}</Link>
    const actions = this.renderBookActions(book)
    const bookDescription = book.description;
    const author = <Link to={`/authors/${book.authorId}`}>{book.authorName}</Link>

    if (card) {
      return (
        <List.Item key={book.id} >
          <Card
            hoverable
            actions={actions}
            cover={<img width={175}  height={230} alt={book.title} src={(book.links ? book.links.image : null) || defaultBookImage} onError={this.setDefaultBookImage} />}
          >
            <Meta
              title={title}
              description={author} />
          </Card>
        </List.Item>
      )
    }
    else {
      return (
        <List.Item key={book.id}
          actions={actions}
          extra={<img width={175} height={230} alt="logo" src={ (book.links && book.links.image) || defaultBookImage} onError={this.setDefaultBookImage} />}>
          <List.Item.Meta title={title} description={author}>
          </List.Item.Meta>
          <div>{bookDescription}</div>
          {this.renderSeries(book)}
          {this.renderCategories(book)}
        </List.Item>
      );

    }
  }
}

export default injectIntl(BookCard);


BookCard.propTypes = {
  onUpdated: PropTypes.func,
  book: PropTypes.object.isRequired,
  card: PropTypes.bool
};