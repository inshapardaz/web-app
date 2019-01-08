import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet'

import Page from '../Layout/Page.jsx';
import ApiService from '../../services/api';
import rel from '../../utils/rel';
import Image from '../Image.jsx';
import { Button, Tag, Icon, Upload } from 'antd';
import './style.scss';
import { success, error } from '../../utils/notifications';
import EditBook from './EditBook.jsx';
import DeleteBook from './DeleteBook.jsx';
import ChapterList from './ChapterList.jsx';

class BookPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isError: false,
      showBookEdit: false,
      showBookDelete: false,
      book: { title: '', categories: [] }
    }
  }

  componentWillMount() {
    const {
      match: { params },
    } = this.props

    this.loadBook(params.id);
  }

  componentWillReceiveProps(nextProps) {
    const {
      match: { params },
    } = nextProps
    this.loadBook(params.id);
  }

  loadBook(id) {
    this.setState({
      isLoading: true
    });

    const api = new ApiService(this.props.user);
    api.getBook(id)
      .then(
        (result) => {
          this.setState({
            isLoading: false,
            isError: false,
            book: result
          });
        },
        () => {
          this.setState({
            isLoading: false,
            isError: true
          });
        }
      )

    this.setState({
      isLoading: false
    });
  }

  showBookEdit() {
    this.setState({
      showBookEdit: true
    });
  }

  uploadImage(book, file) {
    const api = new ApiService(this.props.user);
    api.upload(rel(book.links, 'image-upload'), file.file)
      .then(res => {
        success('تصویر', `${book.title} کی تصویر محفوظ ہو گئی ہے۔`);
        this.reloadBook();
      }, (e) => {
        error('تصویر', `${book.title} کی تصویر محفوظ نہیں ہو سکی۔`);
      });
  }

  renderBookActions(book) {
    const addFavoriteLink = rel(book.links, 'add-favorite');
    const removeFavoriteLink = rel(book.links, 'remove-favorite');
    const imageUpload = rel(book.links, 'image-upload');
    const editBook = rel(book.links, 'update');
    const deleteBook = rel(book.links, 'delete');

    let buttons = [];

    if (addFavoriteLink) {
      buttons.push(<Button key="add-favorite" ghost>
        <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" /> پسندیدہ بنایں
      </Button>);
    }

    if (removeFavoriteLink) {
      buttons.push(<Button key="remove-favorite" >
        <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" /> پسندیدگی ہٹائیں
      </Button>)
    }

    if (editBook) {
      buttons.push(<Button key="edit-book" ghost onClick={() => this.showBookEdit()}>
        <Icon type="edit" /> تدوین
      </Button>)
    }

    if (imageUpload) {
      const props = {
        customRequest: this.uploadImage.bind(this, book),
        multiple: false,
        showUploadList: false
      };

      buttons.push(<Upload key="book-image-upload" className="uploadButton" {...props}>
        <Button ghost>
          <Icon type="upload" theme="twoTone" twoToneColor="#eb2f96" />  سرورق تبدیل کریں
        </Button>
      </Upload>)
    }

    if (deleteBook) {
      buttons.push(<Button key="delete-book" ghost onClick={() => this.setState({
        showBookDelete: true
      })}>
        <Icon type="delete" /> ہٹائیں
        </Button>)
    }

    if (buttons.length > 0) {
      return (
        <Button.Group size="default" className="book-actions">
          {buttons}
        </Button.Group>)
    }

    return null;
  }

  reloadBook() {
    const {
      match: { params },
    } = this.props

    this.setState({ showBookEdit: false });
    this.loadBook(params.id);
  }

  renderBook(book) {
    return (
      <div className="card-body bookDescription">
        <h2 className="mb-3 text-black bookDescription__title">
          <strong >{book.title}</strong>
        </h2>
        <dl className="row">
          <dt className="col-xl-3">مصنّف:</dt>
          <dd className="col-xl-9"><Link to={`/authors/${book.authorId}`}>{book.authorName}</Link></dd>
          <dt className="col-xl-3">تعارف:</dt>
          <dd className="col-xl-9">{book.description}</dd>
          <dt className="col-xl-3">زمرہ جات:</dt>
          <dd className="col-xl-9">
            {book.categories.map(t =>
              <Tag key={t.id} closable={false}>{t.name}</Tag>
            )}
          </dd>
          <dt className="col-xl-3">رسائی:</dt>
          <dd className="col-xl-9">
            <Tag closable={false}>
              {book.isPublic ? "عوامی" : "ذاتی"}
            </Tag>
          </dd>
        </dl>
      </div>
    )
  }

  renderBookEdit(book) {
    if (this.state.showBookEdit) {
      return (
        <EditBook book={book}
          visible={true}
          createNew={false}
          createLink={null}
          onCancel={() => this.setState({ showBookEdit: false })}
          onOk={() => this.reloadBook()} />
      );
    }

    return null;
  }

  renderBookDelete(book) {
    if (this.state.showBookDelete) {
      return (
        <DeleteBook book={book}
          onOk={() => this.props.history.push('/books')}
          onCancel={() => this.setState({ showBookDelete: false })} />
      );
    }

    return null;
  }

  render() {
    const { isLoading, isError, book } = this.state;

    if (isLoading) {
      return <div>Loading...</div>
    }

    if (isError) {
      return <div>Error loading book. Please retry.</div>
    }

    return (
      <Page isLoading={isLoading}>
        <Helmet title={book.title} />
        <div className="profile">
          <div className="row">
            <div className="col-xl-4">
              <div className="card profile__header" style={{ backgroundImage: 'url(/resources/images/bkg_3.jpeg)' }}>
                <div className="profile__header-card">
                  <div className="card-body text-center">
                    <Image source={book} height="110px" width="110px" />
                    {this.renderBookActions(book)}
                  </div>
                </div>
              </div>
              <div className="card">
                {this.renderBook(book)}
              </div>
            </div>
            <div className="col-xl-8">
              <ChapterList book={book} />
            </div>
          </div>
        </div>
        {this.renderBookEdit(book)}
        {this.renderBookDelete(book)}
      </Page>);
  }
}

export default connect(
  state => ({
    user: state.oidc.user
  }), null)(BookPage);
