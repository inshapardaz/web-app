import React from 'react';
import { withRouter } from 'react-router'

import { getAuthors } from '../../utils/fetchApi'
import queryString from 'query-string'
import { List, Card, Spin  } from 'antd';
import Image from '../Image.jsx';
import { Pagination } from 'antd';

const { Meta } = Card;

class AuthorsHome extends React.Component
{
  constructor(props){
    super(props);
    this.state = {
      isError: false,
      isLoading: false,
      authors: null
    };
  }
  componentDidMount()
  {
    const values = queryString.parse(this.props.location.search)
    this.loadAuthors(values.page);
  }

  componentWillReceiveProps(nextProps){
    const values = queryString.parse(nextProps.location.search)
    this.loadAuthors(values.page);
  }

  onPageChange = (page, pageSize) =>
  {
    this.props.history.push(`/authors?page=${page}`);
  }

  loadAuthors(page = 1)
  {
    this.setState({
      isLoading : true
    });

    getAuthors(page)
    .then(
      (result) => {
        this.setState({
          isLoading : false,
          authors: result
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

  render(){
    const { isError, isLoading, authors } = this.state;

    if (isError)
    {
      return <h5>Unable to load authors</h5>;
    }
    else if (isLoading || !authors)
    {
      return (<div className="loading">
                <Spin />
              </div>);
    }
    else if ( authors)
    {
      return (
        <div>
          <div className="pageHeader">Authors</div>
          <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 4, xxl: 3 }}
              dataSource={authors.data}
              renderItem={item => (
                <List.Item>
                  <Card hoverable
                      style={{ width: 240 }}
                      cover={<Image source={item} />}>
                    <Meta
                      title={item.name}
                      description={`Published ${item.bookCount} books`}
                    />
                  </Card>
                </List.Item>
              )}
            />
          <Pagination hideOnSinglePage={true}
                      defaultCurrent={authors.currentPageIndex}
                      pageSize={authors.pageSize}
                      total={authors.totalCount}
                      onChange={this.onPageChange}/>
        </div>
      );
    }
    return null;
  }
}

export default withRouter(AuthorsHome);
