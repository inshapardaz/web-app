import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import queryString from 'query-string';

import ApiService from '../../services/ApiService';
import { Card, Icon, Button, Segment, Header, Confirm, Pagination } from 'semantic-ui-react';
import { ErrorPlaceholder, EmptyPlaceholder, Loading } from '../Common';
import AuthorCard from './AuthorCard';
import EditAuthor from './EditAuthor';

class AuthorHome extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isError: false,
      isLoading: true,
      authors: { items: [] },
      showEditor: false,
      selectedAuthor: null,
      isAdding: false,
      confirmDelete: false,
      pageNumber: 1
    };

    this.onPageChange = this.onPageChange.bind(this);
    this.onAuthorUpdated = this.onAuthorUpdated.bind(this);
  }

  async componentDidMount() {
    const values = queryString.parse(this.props.location.search)
    await this.loadAuthors(values.page? values.page : 1);
  }

  async componentWillReceiveProps(nextProps) {
    const values = queryString.parse(nextProps.location.search)
    
    if (this.state.pageNumber != values.page)
    {
      await this.loadAuthors(values.page);
    }
  }

  async reloadAuthors(){
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
    catch(e){
      console.log('exception', e)
      this.setState({
        isLoading: false,
        isError: true
      });
    }
  }

  onPageChange(e, { activePage }) {
    if (this.state.pageNumber != activePage)
    {
      this.props.history.push(`/authors?page=${activePage}`);
    }
  }

  addAuthor(){
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

  renderEmptyPlaceHolder() {
    const { intl } = this.props;
    const message = intl.formatMessage({ id: 'authors.messages.empty' });
    const buttonText = intl.formatMessage({ id: 'authors.action.create' });

    return (
      <EmptyPlaceholder message={message} iconName='folder outline'
        showButton={true} buttonText={buttonText}
        buttonAction={this.addAuthor.bind(this)} />
    );
  }

  renderLoadingError() {
    const { intl } = this.props;
    const message = intl.formatMessage({ id: 'authors.messages.error.loading' });
    const buttonText = intl.formatMessage({ id: 'action.retry' });
    return (<ErrorPlaceholder message={message}
      showButton={true} buttonText={buttonText}
      buttonAction={this.reloadAuthors.bind(this)} />)
  }

  renderAuthors(authors){
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
    const { isAdding, selectedAuthor } = this.state;
    if (isAdding && selectedAuthor) {
      return (<EditAuthor open={true} author={selectedAuthor}
        createLink={createLink} isAdding={true}
        onOk={this.reloadAuthors.bind(this)}
        onClose={this.onCloseEdit.bind(this)} />);
    }

    return null;
  }


  render() {
    const { authors, isLoading, isError, pageNumber } = this.state;
    const createLink = (authors && authors.links) ? authors.links.create : null;

    if (isLoading) {
      return <Loading />;
    } else if (isError) {
      return this.renderLoadingError();
    }

    let addButton = null;
    if (createLink) {
      addButton = (
                    <Button onClick={this.addAuthor.bind(this)} icon attached='top' ><Icon name='add' />
                      <FormattedMessage id="authors.action.create" />
                    </Button>);
    }

    if (authors && authors.data && authors.data.length > 0) {
      return (
        <>
          <Header as='h2' icon='user' content={<FormattedMessage id="header.authors" />} />
          {addButton}

          <Segment padded={true} attached>
              <Card.Group stackable centered>{this.renderAuthors(authors)}</Card.Group> 

             
          </Segment>
            <Pagination defaultActivePage={pageNumber} 
                          totalPages={authors.pageCount} 
                          onPageChange={this.onPageChange} 
                          pointing
                          secondary attached='bottom'/>
          {this.renderDelete()}
          {this.renderEditor(createLink)}
        </>
      );
    }
    else
      return this.renderEmptyPlaceHolder();
  }
}

export default injectIntl(AuthorHome);