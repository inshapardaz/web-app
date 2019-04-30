import React, { Component } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router";

import { Typography, Row, Tag, Icon, Card, Col } from 'antd';
import { Helmet } from 'react-helmet'

import { ErrorPlaceholder, Loading } from '../Common';
import ApiService from '../../services/ApiService';
import ChapterList from '../Chapter/ChapterList';
import EditBook from './EditBook';
import UploadBookImage from './UploadBookImage';
import DeleteBook from './DeleteBook';

const { Text, Paragraph, Title } = Typography;

const cardStyle = {
  marginBottom: "12px"
}
const imageCardStyle = {
  marginBottom: "12px",
  textAlign: 'center'
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
      actions.push(<EditBook block button key="edit" book={book} onUpdated={this.reloadBook} />)
    }

    if (imageLink) {
      actions.push(<UploadBookImage block button key="uploadimage" book={book} onUpdated={this.reloadBook} />);
    }

    if (deleteLink) {
      actions.push(<DeleteBook block button key="delete" book={book} onDeleted={this.reloadBook} />);
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
      <><Tag color="green">{this.props.intl.formatMessage({ id: 'book.public' })}</Tag></> :
      <><Tag color="red">{this.props.intl.formatMessage({ id: 'book.private' })}</Tag></>}</Text>);

    const categories = book.categories.map(c => <Tag key={c.id}><Link to={`/books?category=${c.id}`}><Icon type="tag" /> {c.name}</Link></Tag>);
    const publishYear = book.yearPublished > 0 ? (<><Icon type="printer" /> {this.props.intl.formatMessage({ id: 'book.publish' }, { year: book.yearPublished })}</>) : null;
    const series = book.seriesName ? (
      <>
        {this.props.intl.formatMessage({ id: 'book.series' }, { index: book.seriesIndex })}
        <Tag style={{ marginLeft: '4px' }}>
          <Icon type="link" />
          <Link to={`/books?series=${book.seriesId}`}>{book.seriesName}</Link>
        </Tag>
      </>) : null;
    const content = (
      <>
        <Paragraph>
          <Title level={2}>{book.title}</Title>
        </Paragraph>
        <Paragraph>
          <Link to={`/authors/${book.authorId}`}>{book.authorName}</Link>
        </Paragraph>
        <Paragraph>
          {availability}
        </Paragraph>
        <Paragraph>
          <Text type="secondary">{book.description}</Text>
        </Paragraph>
        <Paragraph>{categories}</Paragraph>
        <Paragraph>{series}</Paragraph>
        <Paragraph>{publishYear}</Paragraph>
        <Paragraph><Icon type="key" />{this.props.intl.formatMessage({ id: `copyrights.${book.copyrights}` })}</Paragraph>
        <Paragraph>
          {this.renderBookActions(book)}
        </Paragraph>
      </>
    );

    return (
      <>
        <Helmet title={book.title} />
        <Row gutter={16}>
          <Col md={24} lg={8}>
            <Card type="inner" style={imageCardStyle} >
              <img src={book.links.image || '/resources/img/book_placeholder.png'} alt={book.title} />
            </Card>
            <Card type="inner" style={cardStyle}>
              {content}
            </Card>
          </Col>
          <Col md={24} lg={16}>
            <ChapterList book={book} />
          </Col>
        </Row>
        
      </>
    )
  }
}

export default withRouter(injectIntl(BookPage))
