import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import queryString from 'query-string';
import ApiService from '../../services/ApiService';
import { Confirm } from 'semantic-ui-react';
import { ErrorPlaceholder, EmptyPlaceholder, Loading } from '../Common';

import { Pagination, List, Switch } from 'antd';
import { Helmet } from 'react-helmet'

import AuthorCard from './AuthorCard';
import EditAuthor from './EditAuthor';

class AuthorsPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isError: false,
      isLoading: true,
      authors: { items: [] },
      pageNumber: 1,
      showCard: true
    };

    this.reloadAuthors = this.reloadAuthors.bind(this);
  }

  async componentDidMount() {
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

  renderEmptyPlaceHolder(createLink) {
    const { intl } = this.props;
    const message = intl.formatMessage({ id: 'authors.messages.empty' });
    return (
      <EmptyPlaceholder fullWidth={true} message={message} iconName='user' showButton={false} >
        {this.renderAdd(createLink)}
      </EmptyPlaceholder>);
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
    this.setState({ showCard: checked })
  }

  render() {
    const { authors, isLoading, showCard, isError, pageNumber } = this.state;
    const createLink = (authors && authors.links) ? authors.links.create : null;

    if (isLoading) {
      return <Loading fullWidth={true} />
    } else if (isError) {
      return this.renderLoadingError();
    }

    if (authors && authors.data && authors.data.length > 0) {
      return (
        <>
          <Helmet title={this.props.intl.formatMessage({ id: "header.authors" })} />
          <main id="main-container">
            <div className="block">
              <div className="block-header">
                <FormattedMessage id="header.authors" />
                <div className="block-options">
                  {this.renderAdd(createLink)}
                  <span className="ml-2" />
                  <Switch checkedChildren={this.props.intl.formatMessage({ id: "action.list" })}
                    unCheckedChildren={this.props.intl.formatMessage({ id: "action.card" })}
                    onChange={this.onToggleCardView.bind(this)} />
                </div>
              </div>
              <div className="block-content">
                <List
                  itemLayout={showCard ? null : "vertical"}
                  size="large"
                  grid={showCard ? { gutter: 8, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 6 } : null}
                  bordered
                  dataSource={authors.data}
                  renderItem={a => (<AuthorCard key={a.id} card={showCard} author={a} onUpdated={this.reloadAuthors} />)}
                  footer={<Pagination hideOnSinglePage
                    defaultCurrent={pageNumber}
                    total={authors.totalCount}
                    pageSize={authors.pageSize}
                    onChange={this.onPageChanged} />}
                />

              </div>
            </div>
          </main>
        </>
      );
    }
    else
      return this.renderEmptyPlaceHolder(createLink);
  }
}

export default injectIntl(AuthorsPage);