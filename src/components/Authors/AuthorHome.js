import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import ApiService from '../../services/ApiService';
import { Card, Icon, Button, Segment, Header, Confirm, Pagination } from 'semantic-ui-react';
import { ErrorPlaceholder, EmptyPlaceholder, Loading } from '../Common';
import AuthorCard from './AuthorCard';
import EditAuthor from './EditAuthor';
import { Parallax, Background } from 'react-parallax';

class AuthorHome extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isError: false,
      isLoading: true,
      authors: { items: [] },
      showEditor: false,
      selectedAuthor: {},
      isAdding: false,
      confirmDelete: false,
      pageNumber: 1
    };

    this.onPageChange = this.onPageChange.bind(this);
    this.onAuthorUpdated = this.onAuthorUpdated.bind(this);
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
        pageNumber: pageNumber
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

  onPageChange(e, { activePage }) {
    if (this.state.pageNumber != activePage) {
      this.props.history.push(`/authors?page=${activePage}`);
    }
  }

  addAuthor() {
    this.setState({
      selectedAuthor: {},
      isAdding: true,
    });
  }

  onCloseEdit() {
    this.setState({
      isAdding: false
    });
  }

  async onAuthorUpdated() {
    await this.reloadAuthors();
    this.setState({
      selectedAuthor: null
    });
  }

  renderEmptyPlaceHolder(create) {
    const { intl } = this.props;
    const message = intl.formatMessage({ id: 'authors.messages.empty' });
    const buttonText = intl.formatMessage({ id: 'authors.action.create' });

    return (
      <>
        {createLink ? this.renderEditor(createLink) : null}
        <main id="tg-main" className="tg-main tg-haslayout">
          <EmptyPlaceholder  fullWidth={true}  message={message} iconName='folder outline'
            showButton={true} buttonText={buttonText}
            buttonAction={this.addAuthor.bind(this)} />
        </main>
      </>
    );
  }

  renderLoadingError() {
    const { intl } = this.props;
    const message = intl.formatMessage({ id: 'authors.messages.error.loading' });
    const buttonText = intl.formatMessage({ id: 'action.retry' });
    return (<ErrorPlaceholder fullWidth={true}  message={message}
      showButton={true} buttonText={buttonText}
      buttonAction={this.reloadAuthors.bind(this)} />)
  }

  renderAuthors(authors) {
    return authors.data.map(a =>
      <AuthorCard key={a.id} author={a} onUpdated={this.onAuthorUpdated} />)
  }


  renderDelete() {
    const { confirmDelete, selectedAuthor } = this.state;
    if (confirmDelete && selectedAuthor) {
      const { intl } = this.props;

      return (<Confirm size="mini" open={confirmDelete}
        content={intl.formatMessage({ id: 'authors.action.confirmDelete' }, { name: selectedAuthor.name })}
        cancelButton={intl.formatMessage({ id: 'action.no' })}
        confirmButton={intl.formatMessage({ id: 'action.yes' })}
        onCancel={() => this.setState({ confirmDelete: false })}
        onConfirm={this.deleteAuthor.bind(this)} closeIcon />);
    }

    return null;
  }

  renderEditor(createLink) {
    const { isAdding, showEditor, selectedAuthor } = this.state;
    return (<EditAuthor open={isAdding | showEditor} author={selectedAuthor}
      createLink={createLink} isAdding={isAdding}
      onOk={this.reloadAuthors.bind(this)}
      onClose={this.onCloseEdit.bind(this)} />);
  }


  render() {
    const { authors, isLoading, isError, pageNumber } = this.state;
    const createLink = (authors && authors.links) ? authors.links.create : null;

    if (isLoading) {
      return <Loading fullWidth={true} />
    } else if (isError) {
      return this.renderLoadingError();
    }

    let addButton = null;
    if (createLink) {
      addButton = <a className="tg-btn" onClick={this.addAuthor.bind(this)} href="javascript:void(0);"><FormattedMessage id="authors.action.create" /></a>
    }

    if (authors && authors.data && authors.data.length > 0) {
      return (
        <>
          <AuthorsHeader />
          <main id="tg-main" className="tg-main tg-haslayout">
            <div className="tg-authorsgrid">
              <div className="container">
                <div className="row">
                  <div className="tg-authors">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <div className="tg-sectionhead">
                        <h2>{this.props.intl.formatMessage({ id: 'header.authors' })}</h2>
                        {addButton}
                      </div>
                    </div>

                    {this.renderAuthors(authors)}
                  </div>
                </div>
              </div>
            </div>
            <Pagination defaultActivePage={pageNumber}
              totalPages={authors.pageCount}
              onPageChange={this.onPageChange}
              pointing
              secondary attached='bottom' />
            {this.renderDelete()}
            {this.renderEditor(createLink)}
          </main>
        </>
      );
    }
    else
      return this.renderEmptyPlaceHolder(createLink);
  }
}

export default injectIntl(AuthorHome);

class AuthorsHeader extends React.Component {
  render() {
    return (
      <div className="tg-innerbanner tg-haslayout tg-parallax tg-bginnerbanner" data-z-index="-100" data-appear-top-offset="600" style={{ backgroundImage: `url('/images/parallax/bgparallax-04.jpg')` }}>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div className="tg-innerbannercontent">
                <h1><FormattedMessage id="header.authors" /></h1>
                <ol className="tg-breadcrumb">
                  <li><Link to="/"><FormattedMessage id="header.home" /></Link></li>
                  <li className="tg-active"><FormattedMessage id="header.authors" /></li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>);
  }
}