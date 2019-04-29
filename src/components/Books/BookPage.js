import React, { Component } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router";

import { PageHeader, Typography, Button, Row, Tag, Icon } from 'antd';
import { Helmet } from 'react-helmet'

import { ErrorPlaceholder, Loading } from '../Common';
import ApiService from '../../services/ApiService';
import ChapterList from '../Chapter/ChapterList';
import EditBook from './EditBook';
import UploadBookImage from './UploadBookImage';
import DeleteBook from './DeleteBook';

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

class BookPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookId: null,
      book: null,
      confirmDelete: false
    }

    this.reloadBook = this.reloadBook.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDeleted = this.onDeleted.bind(this);
  }

  async componentDidMount() {
    const {
      match: { params },
    } = this.props;

    await this.loadBook(params.id);
  }

  async componentWillReceiveProps(nextProps) {
    const { match: { params } } = nextProps

    if (this.state.bookId != params.id) {
      await this.loadBook(params.id);
    }
  }

  reloadBook = async () => await this.loadBook(this.state.bookId);

  async loadBook(bookId) {
    this.setState({
      isLoading: true,
      showEdit: false,
      bookId: bookId
    });

    try {
      let result = await ApiService.getBook(bookId);
      this.setState({
        isLoading: false,
        isError: false,
        book: result
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
    const message = intl.formatMessage({ id: 'book.messages.error.loading' });
    const buttonText = intl.formatMessage({ id: 'action.retry' });
    return (<ErrorPlaceholder message={message}
      showButton={true} buttonText={buttonText}
      buttonAction={this.reloadBook.bind(this)} />)
  }

  renderBookActions(book) {

    let actions = [];

    if (!book || !book.links) return null;
    const editLink = book.links.update;
    const deleteLink = book.links.delete;
    const imageLink = book.links.image_upload;

    if (editLink) {
      actions.push(<EditBook button key="edit" book={book} onUpdated={this.reloadBook} />)
    }

    if (imageLink) {
      actions.push(<UploadBookImage button key="uploadimage" book={book} onUpdated={this.reloadBook} />);
    }

    if (deleteLink) {
      actions.push(<DeleteBook button key="delete" book={book} onDeleted={this.reloadBook} />);
    }

    if (actions.length > 0) {
      return actions;
    }

    return null;
  }

  onEdit = () => this.setState({ showEdit: true });
  onCloseEdit = () => this.setState({ showEdit: false });

  renderEdit(book) {
    if (this.state.showEdit && book) {
      return (<EditBook open={true} book={book}
        authorId={book.authorId}
        createLink={null} isAdding={false}
        onOk={this.reloadBook}
        onClose={this.onCloseEdit} />);
    }
  }

  onDeleted = () => this.props.history.push(`/books`)

  render() {
    const { book, isLoading, isError } = this.state;

    if (isLoading) {
      return <Loading fullWidth={true} />;
    }

    if (isError) {
      return this.renderLoadingError();
    }

    if (!book) {
      return null;
    }

    var availability = (<Text type="secondary">{book.isPublic ?
      <><Tag color="green">{this.props.intl.formatMessage({ id: 'book.public'})}</Tag></> :
      <><Tag color="red">{this.props.intl.formatMessage({ id: 'book.private'})}</Tag></>}</Text>);

    const categories = book.categories.map(c => <Tag key={c.id}><Link to={`/books?category=${c.id}`}><Icon type="tag" /> {c.name}</Link></Tag>);
    const publishYear = book.yearPublished > 0 ? (<><Icon type="printer" /> <FormattedMessage id="book.publish" values={{year: book.yearPublished}}/></>) : null;
    const series = book.seriesName ? (
      <>
        {this.props.intl.formatMessage({ id: 'book.series'}, {index : book.seriesIndex})}
        <Tag style={{marginLeft : '4px'}}>
          <Icon type="link" />
          <Link to={`/books?series=${book.seriesId}`}>{book.seriesName}</Link>
        </Tag>
      </>) : null;
    const content = (
      <>
        <Paragraph>
          <Text type="secondary">{book.description}</Text>
        </Paragraph>
        <Row>
          <Row>{categories}</Row>
          <Row>{series}</Row>
          <Row>{publishYear}</Row>
          <Row><Icon type="key" />{this.props.intl.formatMessage({ id: `copyrights.${book.copyrights}` })}</Row>
        </Row>
        <div className="contentLink">
          <ButtonGroup>
            {this.renderBookActions(book)}
          </ButtonGroup>
        </div>
      </>
    );

    return (
      <>
        <HeaderStyle />
        <Helmet title={book.title} />
        <PageHeader title={<Title level={2}>{book.title}</Title>} onBack={() => window.history.back()}
          subTitle={<>{availability}<Link to={`/authors/${book.authorId}`}>{book.authorName}</Link></>}>
          <div className="wrap">
            <div className="content">{content}</div>
            <div className="extraContent">{<img src={book.links.image || '/resources/img/book_placeholder.png'} alt={book.title} />}</div>
          </div>
        </PageHeader>
        <ChapterList book={book} />
      </>
    )
  }
}

export default withRouter(injectIntl(BookPage))
