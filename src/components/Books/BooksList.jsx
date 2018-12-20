import React from 'react';
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom';
import { List, Card, Tag, Icon, Upload } from 'antd';
import Image from '../Image.jsx';
import IconText from '../IconText.jsx';
import rel from '../../utils/rel';

import './style.scss';

const { Meta } = Card;

class BookList extends React.Component {
  pagerRender(current, type, originalElement) {
    if (type === 'prev') {
      return <a>پِچھلا</a>;
    } if (type === 'next') {
      return <a>اگلا</a>;
    }
    return originalElement;
  }

  getBookActions(book) {
    let actions = [
      <IconText type={book.isPublic ? 'global' : 'lock'} />,
      <IconText type="tags" text={book.categories.map(t => <Tag key={t.id} closable={false}>{t.name}</Tag>)} />];

      const editLink = rel(book.links, 'update');
      const deleteLink = rel(book.links, 'delete');
      const uploadImageLink = rel(book.links, 'image-upload');

      if (deleteLink) {
        actions.push(<Icon type="delete" onClick={() => this.props.onDelete(book)} />)
      }
      if (uploadImageLink){
        const props = {
          //customRequest: this.props.onUploadImage(book),
          multiple: false,
          showUploadList: false
        };

        actions.push( <Upload {...props}><Icon type="picture" /></Upload>)
      }
      if (editLink) {
        actions.push(<Icon type="edit" onClick={() => this.props.onEdit(book)} />)
      }

    return actions;
  }

  renderList(props){
    const { books, onPageChange, isLoading } = props;
    return(
      <div className="book-list">
      <List
        itemLayout="vertical"
        size="large"
        loading={isLoading}
        pagination={{
          hideOnSinglePage: true,
          onChange: onPageChange,
          pageSize: books.pageSize,
          current: books.currentPageIndex,
          total: books.totalCount,
          itemRender: this.pagerRender
        }}
        locale= {{ emptyText: 'کوئی کتاب موجود نہیں'}}
        dataSource={books.data}
        renderItem={book => (
          <List.Item
            extra={<Image source={book} height="168" />}
            actions={this.getBookActions(book)}
          >
            <Meta
              title={<Link to={'/books/' + book.id} >{book.title}</Link>}
              description={<Link to={'/authors/' + book.authorId}>{book.authorName}</Link>}
            />
            {book.description}
          </List.Item>
        )}
      />
      </div>
    );
  }

  renderError(props){
    return ( <div className="error-message">
        <span className="error-message__title">کتابیں حاصل کرنے میں ناکامی ہوئی۔</span>
        <Button onClick={props.reload()} >دوبارہ کوشش کریں</Button>
      </div>
    );
  }

  render() {
    if (this.props.isError) {
      return this.renderError(this.props);
    }

    return this.renderList(this.props);
  }
}

export default withRouter(BookList);
