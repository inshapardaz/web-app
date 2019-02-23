import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import queryString from 'query-string';

import ApiService from '../../services/ApiService';
import { success, error } from '../../services/toasts';
import { Card, Menu, Icon, Button, Segment, Header, Confirm, Pagination, Container } from 'semantic-ui-react';
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
      showEdit: false,
      confirmDelete: false,
      pageNumber: 1
    };

    this.onPageChange = this.onPageChange.bind(this);
  }

  async componentDidMount() {
    const values = queryString.parse(this.props.location.search)

    if (values.page)
    {
      this.setState({
        pageNumber: values.page
      });
    }

    await this.loadAuthors();
  }

  async componentDidUpdate(nextProps) {
    const values = queryString.parse(nextProps.location.search)
    
    if (this.state.pageNumber != values.page)
    {
      this.setState({
        pageNumber: values.page
      });
      this.loadAuthors();
    }
  }

  async loadAuthors() {
    console.log(`Loading page number ${this.state.pageNumber}`)
    this.setState({
      isLoading: true
    });

    try {
      let result = await ApiService.getAuthors(this.state.pageNumber);
      this.setState({
        isLoading: false,
        isError: false,
        authors: result
      });
    }
    catch{
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
        showEdit: true,
        isAdding: true,
      });
  }

  onEditClicked(author){
    this.setState({
      selectedAuthor: author,
      showEdit: true,
      isAdding: false
    });
  }

  onCloseEdit() {
    this.setState({
      showEdit: false,
      isAdding: false
    });
  }

  onDeleteClicked(author) {
    this.setState({
      selectedAuthor: author,
      confirmDelete: true
    });
  }

  async deleteAuthor() {
    const { selectedAuthor } = this.state;
    if (!selectedAuthor) return;

    let deleteLink = selectedAuthor.links.delete;
    if (!deleteLink) return;

    this.setState({
      confirmDelete: false
    });

    try {
      await ApiService.delete(deleteLink);
      success(this.props.intl.formatMessage({ id: "authors.messages.deleted" }));
      await this.loadAuthors();

      this.setState({
        selectedAuthor: null
      });
    }
    catch{
      error(this.props.intl.formatMessage({ id: "authors.messages.error.delete" }));
    }
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
      buttonAction={this.loadAuthors.bind(this)} />)
  }

  renderAuthors(authors){
    return authors.data.map(a =>
      <AuthorCard key={a.id} author={a} 
        onEdit={this.onEditClicked.bind(this, a)}
        onDelete={this.onDeleteClicked.bind(this, a)} />)
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
    const { isAdding, showEdit, selectedAuthor } = this.state;
    if (showEdit && selectedAuthor) {
      return (<EditAuthor open={showEdit} author={selectedAuthor}
        createLink={createLink} isAdding={isAdding}
        onOk={this.loadAuthors.bind(this)}
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
                    <Button color="blue" onClick={this.addAuthor.bind(this)} icon labelPosition='left' ><Icon name='add' />
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

             <Container textAlign="center" >
              <Pagination defaultActivePage={pageNumber} 
                          totalPages={authors.pageCount} 
                          defaultActivePage={1} 
                          onPageChange={this.onPageChange} 
                          pointing
                          secondary/>
                          </Container>
          </Segment>

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