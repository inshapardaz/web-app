import React, { Component } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
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

  reloadAuthor = async () => await this.loadAuthor(this.state.authorId);

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
    const { author, isLoading, isError } = this.state;

    if (isLoading) {
      return <Loading fullWidth={true} />;
    }

    if (isError) {
      return this.renderLoadingError();
    }

    if (!author) {
      return null;
    }
    return (
      <main id="main-container">
        <div className="content">
          <div className="block">
            <div className="block-content">
              <div className="row items-push">
                <div className="col-md-4 col-lg-5 text-right">
                  <img src={author.links.image || '/resources/img/avatar1.jpg'} alt={author.name} />
                </div>
                <div className="col-md-8 col-lg-7">
                  <h4 className="h3 mb-1"><span className="text-primary-dark">{author.name}</span></h4>
                  <div className="font-size-sm mb-3">
                    {this.props.intl.formatMessage({ id: 'authors.item.book.count' }, { count: author.bookCount })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <BookList author={author} simple={true} />
        </div>
      </main>

    )
  }
}

export default injectIntl(AuthorPage);