import React, { Component } from 'react'
import queryString from 'query-string';
import { injectIntl } from 'react-intl';
import { Helmet } from 'react-helmet'
import { Input, Row, Tabs, Empty } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import BookList from '../Books/BookList';

const SearchBox = Input.Search;
const { TabPane } = Tabs;

class Search extends Component {
  onSubmit = (value) => {
    let values = queryString.parse(this.props.location.search)
    values.q = value;
    this.props.history.push(`${this.props.location.pathname}?${queryString.stringify(values)}`)
  }
  render() {
    let query = queryString.parse(this.props.location.search);
    const booksHeader = this.props.intl.formatMessage({ id: 'search.books.title' }, { title: query.q });
    return (
      <>
        <Helmet title={this.props.intl.formatMessage({ id: "search.title" })} />
        <Row gutter={[16, 16]}>
          <SearchBox
                placeholder={this.props.intl.formatMessage({ id: "header.search.placeholder" })}
                onSearch={this.onSubmit}
                size="large" 
                enterButton
              />
        </Row>
        <div className="row">
          <div className="col-xl-12">
            <Tabs type="card">
              <TabPane tab={this.props.intl.formatMessage({ id: "header.books" })} key="books">
                <BookList title={booksHeader} />
              </TabPane>
              <TabPane tab={this.props.intl.formatMessage({ id: "header.authors" })} key="authors">
                <Empty description={this.props.intl.formatMessage({ id: "comingsoon" })}/>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </> 
    )
  }
}

export default injectIntl(Search)