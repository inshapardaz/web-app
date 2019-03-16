import React, { Component } from 'react'
import { injectIntl } from 'react-intl';
import { Image, Header } from 'semantic-ui-react';
import { ErrorPlaceholder, Loading } from '../Common';
import ApiService from '../../services/ApiService';
import BookList from '../Books/BookList';

class AuthorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isError: false,
      isLoading: true,
      author: null,
      showEditor: false,
      showEdit: false,
      confirmDelete: false,
      authorId: 1
    };
  }

  async componentDidMount() {
    const {
      match: { params },
    } = this.props;

    await this.loadAuthor(params.id);
  }

  async componentWillReceiveProps(nextProps) {
    const { match: { params } } = nextProps

    if (this.state.authorId != params.id) {
      await this.loadAuthor(params.id);
    }
  }

  reloadAuthor = async() => await this.loadAuthor(this.state.authorId);

  async loadAuthor(authorId) {
    this.setState({
      isLoading: true,
      authorId: authorId
    });

    try {
      let result = await ApiService.getAuthor(authorId);
      this.setState({
        isLoading: false,
        isError: false,
        author: result
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

  renderLoadingError() {
    const { intl } = this.props;
    const message = intl.formatMessage({ id: 'author.messages.error.loading' });
    const buttonText = intl.formatMessage({ id: 'action.retry' });
    return (<ErrorPlaceholder message={message}
      showButton={true} buttonText={buttonText}
      buttonAction={this.reloadAuthor.bind(this)} />)
  }

  render() {
    const {author, isLoading, isError} = this.state;

    if (isLoading)
    {
      return <Loading />;
    }

    if (isError)
    {
      return this.renderLoadingError();
    }

    if (!author){
      return null;
    }
    return (
      <div>
        <Header as='h2' >
          <Image circular src={author.links.image || '/resources/img/avatar1.jpg'} />
          <Header.Content>{author.name}</Header.Content>
        </Header>
        <BookList author={author}/>
      </div>
    )
  }
}

export default injectIntl(AuthorPage);