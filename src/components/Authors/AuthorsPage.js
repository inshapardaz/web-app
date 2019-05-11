import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import queryString from 'query-string';

import { Pagination, List, Switch, Card } from 'antd';
import { Helmet } from 'react-helmet'

import ApiService from '../../services/ApiService';
import { ErrorPlaceholder } from '../Common';
import AuthorCard from './AuthorCard';
import EditAuthor from './EditAuthor';

const cardStyle = {
  marginBottom: "12px"
}

class AuthorsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isError: false,
      isLoading: true,
      authors: { items: [] },
      pageNumber: 1,
      showCard: false
    };

    this.reloadAuthors = this.reloadAuthors.bind(this);
  }

  async componentDidMount() {
    this.setState({
      showCard: JSON.parse(localStorage.getItem('authors.cardview'))
    })
    const values = queryString.parse(this.props.location.search)
    await this.loadAuthors(values.page ? values.page : 1);
  }

  async componentWillReceiveProps(nextProps) {
    const values = queryString.parse(nextProps.location.search)

    if (this.state.pageNumber != values.page) {
      await this.loadAuthors(values.page);
    }
  }

  async reloadAuthors() {
    await this.loadAuthors(this.state.pageNumber);
  }

  async loadAuthors(pageNumber = 1) {
    this.setState({
      isLoading: true
    });

    try {
      let result = await ApiService.getAuthors(pageNumber);
      this.setState({
        isLoading: false,
        isError: false,
        authors: result,
        pageNumber: parseInt(pageNumber)
      });
    }
    catch (e) {
      console.error(e)
      this.setState({
        isLoading: false,
        isError: true
      });
    }
  }

  onPageChanged = (page) => {
    if (this.state.pageNumber != page) {
      this.props.history.push(`/authors?page=${page}`);
    }
  }

  renderLoadingError() {
    const { intl } = this.props;
    const message = intl.formatMessage({ id: 'authors.messages.error.loading' });
    const buttonText = intl.formatMessage({ id: 'action.retry' });
    return (<ErrorPlaceholder fullWidth={true} message={message}
      showButton={true} buttonText={buttonText}
      buttonAction={this.reloadAuthors.bind(this)} />)
  }

  renderAdd(createLink) {
    if (createLink) {
      return <EditAuthor button createLink={createLink} isAdding={true} onUpdated={this.reloadAuthors} />
    }

    return null;
  }

  onToggleCardView(checked) {
    localStorage.setItem('authors.cardview', checked);
    this.setState({ showCard: checked })
  }

  render() {
    const { authors, isLoading, showCard, isError, pageNumber } = this.state;
    const createLink = (authors && authors.links) ? authors.links.create : null;

    if (isError) {
      return this.renderLoadingError();
    }

    const extras = (<>
      {this.renderAdd(createLink)}
      <span className="ml-2" />
      <Switch checkedChildren={this.props.intl.formatMessage({ id: "action.card" })}
        unCheckedChildren={this.props.intl.formatMessage({ id: "action.list" })}
        onChange={this.onToggleCardView.bind(this)} checked={this.state.showCard} />
    </>)

    const pagination =  authors ? (<Pagination hideOnSinglePage
      size="small"
      current={pageNumber}
      total={authors.totalCount}
      pageSize={authors.pageSize}
      onChange={this.onPageChanged} />) : null;
    return (
      <>
        <Helmet title={this.props.intl.formatMessage({ id: "header.authors" })} />
        <Card title={this.props.intl.formatMessage({ id: "header.authors" })} type="inner" extra={extras} style={cardStyle}>
          <List
            itemLayout={showCard ? null : "vertical"}
            size="large"
            grid={showCard ? { gutter: 8, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 6 } : null}
            dataSource={authors ? authors.data : []}
            loading={isLoading}
            locale={{
              emptyText: this.props.intl.formatMessage({ id: 'authors.messages.empty' })
            }}
            renderItem={a => (<AuthorCard key={a.id} card={showCard} author={a} onUpdated={this.reloadAuthors} />)}
            header={pagination}
            footer={pagination}
          />
        </Card>
      </>
    );
  }
}

export default injectIntl(AuthorsPage);