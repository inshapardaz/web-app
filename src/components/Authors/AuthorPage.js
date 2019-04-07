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
      <>
        <div className="tg-innerbanner tg-haslayout tg-parallax tg-bginnerbanner" data-z-index="-100" data-appear-top-offset="600" data-parallax="scroll" data-image-src="images/parallax/bgparallax-07.jpg">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div className="tg-innerbannercontent">
                  <h1>Authors</h1>
                  <ol className="tg-breadcrumb">
                    <li><Link to="/"><FormattedMessage id="header.home" /></Link></li>
                    <li><Link to="/authors">{this.props.intl.formatMessage({ id: 'header.authors' })}</Link></li>
                    <li className="tg-active">{author.name}</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Header as='h2' >
          <Image circular src={author.links.image || '/resources/img/avatar1.jpg'} />
          <Header.Content>{author.name}</Header.Content>
        </Header>
        <BookList author={author} />
      </>
    )
  }
}

export default injectIntl(AuthorPage);