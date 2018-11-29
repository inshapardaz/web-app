import React from 'react';
import { withRouter } from 'react-router'

import { Link } from 'react-router-dom';
import queryString from 'query-string'
import { List, Card, Tag  } from 'antd';
import Image from '../Image.jsx';

import { getBooks } from '../../utils/fetchApi'
import Page from '../Layout/Page.jsx';
import IconText from '../IconText.jsx';

import './style.scss';

const { Meta } = Card;

class BooksHome extends React.Component
{
  constructor(props){
    super(props);
    this.state = {
      isError: false,
      isLoading: false,
      books: { data:[], pageSize: 0, currentPageIndex: 0, totalCount: 0}
    };
  }
  componentDidMount()
  {
    const values = queryString.parse(this.props.location.search)
    this.loadBooks(values.page);
  }

  componentWillReceiveProps(nextProps){
    const values = queryString.parse(nextProps.location.search)
    this.loadBooks(values.page);
  }

  loadBooks(page = 1)
  {
    this.setState({
      isLoading : true
    });

    getBooks(page)
    .then(
      (result) => {
        this.setState({
          isLoading : false,
          books: result
        });
      },
      (error) => {
        this.setState({
          isLoading : false,
          isError:true
        });
      }
    )
  }

  onPageChange = (page, pageSize) =>
  {
    this.props.history.push(`/books?page=${page}`);
  }

  render(){
    const { isError, isLoading, books } = this.state;
    return (
      <Page {...this.props} title="Books" isLoading={isLoading} isError={isError}>
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
                    <IconText type={book.isPublic ? 'global': 'lock' }/>,
                    <IconText type="tags" text={book.categories.map(t => <Tag key={t.id} closable={false}>{t.name}</Tag>)} />
                    ]}
                >
                <Meta
                  title={<Link to={'/books/' + book.id} >{book.title}</Link>}
                  description={`By ${book.authorName}`}
                />
                {book.description}
              </List.Item>
            )}
          />
      </Page>
    );
  }
}

//
export default withRouter(BooksHome);
