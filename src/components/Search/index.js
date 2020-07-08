import React, { Component } from 'react'
import queryString from 'query-string';
import { injectIntl } from 'react-intl';
import { Helmet } from 'react-helmet'
import { Input, Row, Tabs, Empty } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import BookList from '../Books/BookList';
import AuthorList from '../Authors/AuthorList';

const SearchBox = Input.Search;
const { TabPane } = Tabs;

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query : ''
    };
  }

  async componentDidMount() {
    let values = queryString.parse(this.props.location.search)
    this.setState({query : values.q })
  }

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
                onSearch={this.onSubmit} onChange={(e) => this.setState({query : e.value})}
                size="large" value={this.state.query}
                enterButton
              />
        </Row>
        <div className="row">
          <div className="col-xl-12">
            <Tabs type="card">
              <TabPane tab={this.props.intl.formatMessage({ id: "header.books" })} key="books">
                <BookList title={booksHeader} search={query.q} />
              </TabPane>
              <TabPane tab={this.props.intl.formatMessage({ id: "header.authors" })} key="authors">
                <AuthorList search={query.q} />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </> 
    )
  }
}

export default injectIntl(Search)