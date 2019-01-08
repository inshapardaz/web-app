import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import { Helmet } from 'react-helmet'

import Page from '../Layout/Page.jsx';
import ApiService from '../../services/api';
import rel from '../../utils/rel';
import Image from '../Image.jsx';
import { Button, Tag, List, Icon, Upload } from 'antd';
import './style.scss';
import { success, error } from '../../utils/notifications';
import EditBook from './EditBook.jsx';
import DeleteBook from './DeleteBook.jsx';

class BookPage extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {
      isLoading: false,
      isError: false,
      isLoadingChapters: false,
      isErrorLoadingChapters: false,
      showEdit: false,
      showDelete: false,
      book: { title:'', categories: []},
      chapters: { items: []}
    }
  }

  componentWillMount() {
    const {
      match: { params },
    } = this.props

    this.loadBook(params.id);
    this.loadChapters(params.id);
  }

  componentWillReceiveProps(nextProps){
    const {
      match: { params },
    } = nextProps
    this.loadBook(params.id);
    this.loadChapters(params.id);
  }

  loadBook(id) {
    this.setState({
      isLoading : true
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

  loadChapters(id) {
    this.setState({
      isLoadingChapters: true,
    });

    const api = new ApiService(this.props.user);
    api.getChapters(id)
      .then(
        (result) => {
          this.setState({
            isLoadingChapters: false,
            isErrorLoadingChapters: false,
            chapters: result
          });
        },
        () => {
          this.setState({
            isLoadingChapters: false,
            isErrorLoadingChapters: true
          });
        }
      )

    this.setState({
      isLoadingChapters: false
    });
  }

  showEdit(){
    this.setState({
      showEdit: true
    });
  }

  uploadImage(book, file){
    const api = new ApiService(this.props.user);
    api.upload(rel(book.links, 'image-upload'), file.file)
      .then(res => {
        success('تصویر', `${book.title} کی تصویر محفوظ ہو گئی ہے۔`);
        this.reloadBook();
      },(e) => {
        error('تصویر', `${book.title} کی تصویر محفوظ نہیں ہو سکی۔`);
      });
  }

  renderBookActions(book){
    const addFavoriteLink =  rel(book.links, 'add-favorite');
    const removeFavoriteLink = rel(book.links, 'remove-favorite');
    const imageUpload = rel(book.links, 'image-upload');
    const editBook = rel(book.links, 'update');
    const deleteBook = rel(book.links, 'delete');

    let buttons = [];

    if (addFavoriteLink){
      buttons.push(<Button key="add-favorite" ghost>
        <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" /> پسندیدہ بنایں
      </Button>);
    }

    if (removeFavoriteLink){
      buttons.push(<Button key="remove-favorite" >
        <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" /> پسندیدگی ہٹائیں
      </Button>)
    }

    if (editBook){
      buttons.push(<Button key="edit-book" ghost  onClick={() => this.showEdit()}>
        <Icon type="edit" /> تدوین
      </Button>)
    }

    if (imageUpload){
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

    if (deleteBook){
      buttons.push(<Button key="delete-book" ghost onClick={() => this.setState({
        showDelete : true
      })}>
        <Icon type="delete" /> ہٹائیں
        </Button>)
    }

    if (buttons.length > 0){
      return(
      <Button.Group size="default" className="book-actions">
        {buttons}
      </Button.Group>)
    }

    return null;
  }

  reloadBook(){
    const {
      match: { params },
    } = this.props

    this.setState({showEdit : false});
    this.loadBook(params.id);
  }

  editChapter(chapter){

  }

  onDeleteChapter(chatper){

  }

  getChapterActions(chapter)
  {
    var actions = [];

    const editChapter = rel(chapter.links, 'update');
    const deleteChapter = rel(chapter.links, 'delete');

    if (deleteChapter){
      actions.push(<Icon type="delete" onClick={() => this.onDeleteChapter(chapter)} />)
    }

    if (editChapter){
      actions.push(<Icon type="edit" onClick={() => this.editChapter(chapter)} />)
    }

    return actions;
  }

  renderBook(book){
    return (
      <div className="card-body">
        <h5 className="mb-3 text-black">
          <strong>{book.title}</strong>
        </h5>
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
  )}

  renderDelete(book)
  {
    if (this.state.showDelete){
      return (
        <DeleteBook book={book}
            onOk={() => this.props.history.push('/books')}
            onCancel={() => this.setState({showDelete : false})}/>
      );
    }

    return null;
  }

  renderEdit(book){
    if (this.state.showEdit){
      return (
        <EditBook book={book}
          visible={true}
          createNew={false}
          createLink={null}
          onCancel={() => this.setState({showEdit : false})}
          onOk={() => this.reloadBook()} />
      );
    }

    return null;
  }

  render() {
    const { isLoading, isError, book, isLoadingChapters, chapters } = this.state;

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
                  <List
                    size="large"
                    header={<h3>فہرست</h3>}
                    locale= {{ emptyText: 'کوئی مضمون موجود نہیں'}}
                    bordered
                    loading={isLoadingChapters}
                    dataSource={chapters.items}
                    renderItem={chapter => (
                      <List.Item actions={this.getChapterActions(chapter)}>
                        <Link to={`/books/${book.id}/chapters/${chapter.id}`}>
                          {chapter.chapterNumber}. {chapter.title}
                        </Link>
                      </List.Item>)
                    }
                  />
            </div>
          </div>
        </div>
        {this.renderEdit(book)}
        {this.renderDelete(book)}
      </Page>);
  }
}

export default connect(
  state => ({
    user: state.oidc.user
}), null)(BookPage);
