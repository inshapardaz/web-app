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
        <div className="tg-innerbanner tg-haslayout tg-parallax tg-bginnerbanner" data-z-index="-100" data-appear-top-offset="600" data-parallax="scroll" style={{ backgroundImage: `url('/images/parallax/bgparallax-07.jpg')` }}>
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div className="tg-innerbannercontent">
                  <h1>{author.name}</h1>
                  <ol className="tg-breadcrumb">
                    <li><Link to="/"><FormattedMessage id="header.home" /></Link></li>
                    <li><Link to="/authors">{this.props.intl.formatMessage({ id: 'header.authors' })}</Link></li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
        <main id="tg-main" className="tg-main tg-haslayout">
          <div className="tg-sectionspace tg-haslayout">
            <div className="container">
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <div className="tg-authordetail">
                    <figure className="tg-authorimg">
                      <img src={author.links.image} alt="image description" />
                    </figure>
                    <div className="tg-authorcontentdetail">
                      <div className="tg-sectionhead">
                        <h2><span>{this.props.intl.formatMessage({ id: 'authors.item.book.count' }, { count: author.bookCount })}</span>{author.name}</h2>
                        {/* <ul className="tg-socialicons">
                          <li className="tg-facebook"><a href="javascript:void(0);"><i className="fa fa-facebook"></i></a></li>
                          <li className="tg-twitter"><a href="javascript:void(0);"><i className="fa fa-twitter"></i></a></li>
                          <li className="tg-linkedin"><a href="javascript:void(0);"><i className="fa fa-linkedin"></i></a></li>
                          <li className="tg-googleplus"><a href="javascript:void(0);"><i className="fa fa-google-plus"></i></a></li>
                          <li className="tg-rss"><a href="javascript:void(0);"><i className="fa fa-rss"></i></a></li>
                        </ul> */}
                      </div>
                      <div className="tg-description">
                        <p>Consectetur adipisicing elit sed do eiusmod tempor incididunt labore toloregna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamcoiars nisiuip commodo consequat aute irure dolor in aprehenderit aveli esseati cillum dolor fugiat nulla pariatur cepteur sint occaecat cupidatat.</p>
                        <p>Caanon proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnisate natus error sit voluptatem accusantium doloremque totam rem aperiam, eaque ipsa quae abillo inventoe veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia.</p>
                        <p>Voluptas sit asapernatur aut odit aut fugit, sed quia consequuntur magni dolores eos quistan ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
                      </div>
                      <div className="tg-booksfromauthor">
                        <div className="tg-sectionhead">
                          <h2>{this.props.intl.formatMessage({ id: 'authors.book.title' }, { name: author.name })}</h2>
                        </div>
                        <div className="row">
                          <BookList author={author} simple={true} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }
}

export default injectIntl(AuthorPage);