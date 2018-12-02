import React from 'react';
import { withRouter } from 'react-router'
import {connect} from 'react-redux';
import {Link} from 'react-router-dom'
import { Helmet } from 'react-helmet'

import ApiService from '../../services/api';

import queryString from 'query-string'
import { List, Card, Pagination  } from 'antd';
import Image from '../Image.jsx';
import Page from '../Layout/Page.jsx';

const { Meta } = Card;

class AuthorsHome extends React.Component
{
  constructor(props){
    super(props);
    this.state = {
      isError: false,
      isLoading: false,
      authors: {data:[], pageSize: 0, currentPageIndex: 0, totalCount: 0}
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

    const api = new ApiService(this.props.user);
    api.getAuthors(page)
    .then(
      (result) => {
        this.setState({
          isLoading : false,
          authors: result
        });
      },
      (error) => {
        console.log(error);
        this.setState({
          isLoading : false,
          isError:true
        });
      }
    )
  }

  render(){
    const { authors, isLoading, isError } = this.state;

    return (
      <Page {...this.props} title="Authors" isLoading={isLoading} isError={isError}>
        <Helmet title="Authors" />
        <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 4, xxl: 6 }}
            dataSource={authors.data}
            renderItem={item => (
              <List.Item>
                <Card hoverable
                    style={{ width: 240 }}
                    cover={<Image source={item} />}>
                  <Meta
                    title={<Link to={`/authors/${item.id}`}>{item.name}</Link>}
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
      </Page>
    );
  }
}

export default withRouter(connect(
  state => ({
    user: state.oidc.user
}), null)(AuthorsHome));
