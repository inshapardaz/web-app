import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
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
import EditChapter from './EditChapter.jsx';
import DeleteChapter from './DeleteChapter.jsx';

class BookPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isError: false,
      isLoadingChapters: false,
      isErrorLoadingChapters: false,
      showBookEdit: false,
      showBookDelete: false,
      addNewChapter: false,
      showChapterEdit: false,
      showChapterDelete: false,
      selectedChapter: null,
      book: { title: '', categories: [] },
      chapters: { items: [] }
    }
  }

  componentWillMount() {
    const {
      match: { params },
    } = this.props

    this.loadBook(params.id);
    this.loadChapters(params.id);
  }

  componentWillReceiveProps(nextProps) {
    const {
      match: { params },
    } = nextProps
    this.loadBook(params.id);
    this.loadChapters(params.id);
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

  reloadChapters(){
    const {
      match: { params },
    } = this.props

    this.setState({ showChapterEdit: false, addNewChapter: false } );
    this.loadChapters(params.id)
  }

  addChapter() {
    this.setState({
      showChapterEdit: true,
      addNewChapter: true,
      selectedChapter: {}
    })
  }

  editChapter(chapter) {
    this.setState({
      showChapterEdit: true,
      addNewChapter: false,
      selectedChapter: chapter
    })
  }

  onDeleteChapter(chapter) {
    this.setState({
      showChapterDelete: true,
      selectedChapter: chapter
    })
  }

  getChapterActions(chapter) {
    var actions = [];

    const editChapter = rel(chapter.links, 'update');
    const deleteChapter = rel(chapter.links, 'delete');

    if (deleteChapter) {
      actions.push(<Icon type="delete" onClick={() => this.onDeleteChapter(chapter)} />)
    }

    if (editChapter) {
      actions.push(<Icon type="edit" onClick={() => this.editChapter(chapter)} />)
    }

    return actions;
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

  renderChapterEdit() {
    if (this.state.showChapterEdit) {
      const { book, addNewChapter, selectedChapter } = this.state;
      if (book) {
        const createLink = rel(book.links, 'create-chapter');
        return (
          <EditChapter chapter={selectedChapter}
            visible={true}
            createNew={addNewChapter}
            createLink={createLink}
            onCancel={() => this.setState({ showChapterEdit: false, addNewChapter: false })}
            onOk={() => this.reloadChapters()} />
        );
      }
    }

    return null;
  }

  renderChapterDelete(){
    if (this.state.showChapterDelete) {
      return (
        <DeleteChapter chapter={this.state.selectedChapter}
          onOk={() => this.reloadChapters()}
          onCancel={() => this.setState({ showChapterDelete: false })} />
      );
    }

    return null;
  }

  renderChapterFooter() {
    const { book } = this.state;

    if (book) {
      const createLink = rel(book.links, 'create-chapter');
      if (createLink) {
        return (<Button onClick={() => this.addChapter()}>مضمون کا اضافہ کریں</Button>);
      }
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
                header={<h3 className="chapterTitle">فہرست</h3>}
                footer={this.renderChapterFooter()}
                locale={{ emptyText: 'کوئی مضمون موجود نہیں' }}
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
        {this.renderBookEdit(book)}
        {this.renderBookDelete(book)}
        {this.renderChapterEdit()}
        {this.renderChapterDelete()}
      </Page>);
  }
}

export default connect(
  state => ({
    user: state.oidc.user
  }), null)(BookPage);
