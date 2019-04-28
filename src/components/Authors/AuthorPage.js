import React, { Component } from 'react'
import { injectIntl } from 'react-intl';
import { ErrorPlaceholder, Loading } from '../Common';
import ApiService from '../../services/ApiService';
import BookList from '../Books/BookList';

import { PageHeader, Typography, Button } from 'antd';
import { Helmet } from 'react-helmet'

import EditAuthor from './EditAuthor';
import UploadAuthorImage from './UploadAuthorImage';
import DeleteAuthor from './DeleteAuthor';

const ButtonGroup = Button.Group;
const { Text, Paragraph, Title } = Typography;

const HeaderStyle = () => {
  return <style>{`
    .wrap {
      display: flex;
    }
    .content {
      flex: 1;
    }
    .extraContent {
      min-width: 240px;
      text-align: right;
    }
    .contentLink {
      padding-top: 16px;
    }
    .contentLink a {
      display: inline-block;
      vertical-align: text-top;
      margin-right: 32px;
    }
    .contentLink a img {
      margin-right: 8px;
    }`}</style>;
}
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

  gotoAuthors = () => { this.props.history.push('/authors') }

  renderAuthorActions(author) {
    let actions = [];

    if (!author || !author.links) return null;
    const editLink = author.links.update;
    const deleteLink = author.links.delete;
    const imageLink = author.links.image_upload;

    if (editLink) {
      actions.push(<EditAuthor button key="edit" author={author} onUpdated={this.reloadAuthor} />)
    }

    if (imageLink) {
      actions.push(<UploadAuthorImage button key="uploadimage" author={author} onUpdated={this.reloadAuthor} />);
    }

    if (deleteLink) {
      actions.push(<DeleteAuthor button key="delete" author={author} onDeleted={this.gotoAuthors} />);
    }

    if (actions.length > 0) {
      return actions;
    }

    return null;
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

    const content = (
      <div className="content">
        <Paragraph>
          <Text type="secondary">No Description</Text>
        </Paragraph>
        <div className="contentLink">
          <ButtonGroup>
            {this.renderAuthorActions(author)}
          </ButtonGroup>
        </div>
      </div>
    );

    return (
      <>
        <HeaderStyle />
        <Helmet title={author.name} />
          <PageHeader title={<Title level={3}>{author.name}</Title>} onBack={() => window.history.back()} subTitle={this.props.intl.formatMessage({ id: 'authors.item.book.count' }, { count: author.bookCount })}>
            <div className="wrap">
              <div className="content">{content}</div>
              <div className="extraContent">{<img src={author.links.image || '/resources/img/avatar1.jpg'} alt={author.name} />}</div>
            </div>
          </PageHeader>
          <BookList author={author} wide title={this.props.intl.formatMessage({ id: "authors.book.title" }, { name: author.name })} type="inner" />
      </>

    )
  }
}

export default injectIntl(AuthorPage);