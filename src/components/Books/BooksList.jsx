import React from 'react';
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom';
import { List, Card, Tag } from 'antd';
import Image from '../Image.jsx';
import IconText from '../IconText.jsx';

import './style.scss';

const { Meta } = Card;

class BookList extends React.Component {
  render() {
    const { books } = this.props;
    if (!books)
      return null;
    return (
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: this.onPageChange,
          pageSize: books.pageSize,
          defaultCurrent: books.currentPageIndex,
          total: books.totalCount
        }}
        dataSource={books.data}
        renderItem={book => (
          <List.Item
            extra={<Image source={book} height="168" />}
            actions={[
              <IconText type="star-o" text="156" />,
              <IconText type="like-o" text="156" />,
              <IconText type="message" text="2" />,
              <IconText type={book.isPublic ? 'global' : 'lock'} />,
              <IconText type="tags" text={book.categories.map(t => <Tag key={t.id} closable={false}>{t.name}</Tag>)} />
            ]}
          >
            <Meta
              title={<Link to={'/books/' + book.id} >{book.title}</Link>}
              description={<Link to={'/authors/' + book.authorId}>{book.authorName}</Link>}
            />
            {book.description}
          </List.Item>
        )}
      />
    );
  }
}

export default withRouter(BookList);
