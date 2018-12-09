import React from 'react';
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom';
import { List, Card, Tag } from 'antd';
import Image from '../Image.jsx';
import IconText from '../IconText.jsx';

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

  render() {
    const { books, onPageChange } = this.props;
    if (!books)
      return null;
    console.log(books.currentPageIndex);
    return (
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          hideOnSinglePage: true,
          onChange: onPageChange,
          pageSize: books.pageSize,
          defaultCurrent: books.currentPageIndex,
          total: books.totalCount,
          itemRender: this.pagerRender
        }}
        dataSource={books.data}
        renderItem={book => (
          <List.Item
            extra={<Image source={book} height="168" />}
            actions={[
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
