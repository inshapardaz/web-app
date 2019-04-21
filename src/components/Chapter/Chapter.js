import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import ApiService from '../../services/ApiService';
import Reader from '../Reader/Reader';
import { Menu, Icon, Container, Sticky, Dimmer, Header, Loader } from 'semantic-ui-react';
import { success, error } from '../../services/toasts';

import FontsSizeMenu from '../Reader/FontsSizeMenu';
import FontsMenu from '../Reader/FontsMenu';
import ChaptersMenu from './ChaptersMenu';
import ErrorPlaceholder from '../Common/ErrorPlaceholder';
import ChapterContentEditor from './ChapterContentEditor';
import Loading from '../Common/Loading';

const gotoTop = () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

const ChapterReaderStyle = ({ font, size }) => {
  return (
    <style>{`
    .chapter
    {
      font-size: 16px;
    }

    .chapter__title
    {
      display: block;
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 12px;
      font-family: '${font}' !important;
      /*border-bottom: 1px solid $gray-border;*/
    }
  
    .chapter__contents
    {
      margin: auto;
      padding: 10px;
      padding-top : 4em;
      font-family: '${font}' !important;
      font-size: ${size} !important
    }
  `}</style>
  )
}

const fixedMenuStyle = {
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
}

class Chapter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookId: null,
      chapterId: null,
      contents: null,
      book: null,
      isLoading: false,
      isLoadingContents: false,
      isError: false,
      isEditing: false,
      fontSize: '',
      theme: localStorage.getItem('reader.theme') || 'default',
      font: '',
      dirty: false,
      saving: false,
      sidebarOpen: false
    };

    this.changeFontSize = this.changeFontSize.bind(this);
    this.changeFont = this.changeFont.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onContentChange = this.onContentChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onCloseEdit = this.onCloseEdit.bind(this);
  }

  async componentDidMount() {
    const {
      match: { params },
    } = this.props

    await this.loadData(params.id, params.chapterId);
  }

  async componentWillReceiveProps(nextProps) {
    const {
      match: { params },
    } = nextProps

    await this.loadData(params.id, params.chapterId);
  }

  async reload() {
    await this.loadData(this.state.bookId, this.state.chapterId);
  }

  async loadData(bookId, chapterId) {
    this.setState({
      bookId: bookId,
      chapterId: chapterId,
      isLoading: true,
      isLoadingContents: true
    });

    try {
      var book = await ApiService.getBook(bookId);
      this.setState({
        book: book
      });

      var chapter = await ApiService.getChapter(bookId, chapterId);
      this.setState({
        chapter: chapter,
      });
      var contents = await ApiService.getChapterContents(bookId, chapterId);

      this.setState({
        isLoading: false,
        isLoadingContents: false,
        contents: contents
      });
    }
    catch (e) {
      if (e.response.status == 404) {
        this.setState({
          isLoading: false,
          isLoadingContents: false,
          contents: { contents: '' }
        });
      }
      else {
        this.setState({
          isLoading: false,
          isLoadingContents: false,
          isError: true
        });
      }
    }
  }

  toggleSidebar() {
    this.setState(prevState => ({
      sidebarOpen: !prevState.sidebarOpen
    }));
  }

  changeFontSize(value) {
    this.setState({
      fontSize: value
    });
  }

  changeFont(font) {
    this.setState({
      font: font
    });
  }

  changeTheme(e) {
    this.setState({
      theme: e.key
    });
    localStorage.setItem('reader.theme', e.key);
  }

  onEdit() {
    this.setState({
      isEditing: true,
      dirty: false
    })
  }

  onContentChange(contents) {
    var oldContents = { ...this.state.contents }
    oldContents.contents = contents;

    this.setState({
      dirty: true,
      contents: oldContents
    })
  }

  async onSave() {
    this.setState({
      saving: true
    })
    try {
      const { chapter, contents } = this.state;
      const updateLink = contents && contents.links ? contents.links.update : null;
      const createLink = chapter && chapter.links ? chapter.links.add_contents : null;
      if (updateLink) {
        await ApiService.put(updateLink, JSON.stringify(contents.contents));
      }
      else if (createLink) {
        await ApiService.post(createLink, JSON.stringify(contents.contents));
      }
      this.setState({
        dirty: false,
        saving: false
      })
      success(this.props.intl.formatMessage({ id: "chapter.messages.saved" }));
    }
    catch (e) {
      console.error(e);
      this.setState({
        saving: false
      })
      error(this.props.intl.formatMessage({ id: "chapters.messages.error.saving" }));
    }
  }

  onCloseEdit() {
    this.setState({
      isEditing: false,
      dirty: false
    })
  }

  renderEditMenu(chapter, contents, isEditing) {
    if (!contents) return null;

    const addLink = chapter && chapter.links ? chapter.links.add_contents : null;
    const editLink = contents && contents.links ? contents.links.update : null;
    if (editLink || addLink) {
      if (isEditing) {
        return [<Menu.Item color="green" icon="save" onClick={this.onSave} />,
        <Menu.Item color="orange" icon="close" onClick={this.onCloseEdit} />];
      }

      return (<Menu.Item color="blue" icon="edit" onClick={this.onEdit} />);
    }

    return null;
  }

  handleContextRef = contextRef => this.setState({ contextRef })

  renderSideBar() {
    const { book, chapter } = this.state;
    return (
      <nav id="sidebar">
        <div className="sidebar-content">
          <div className="content-side content-side-full pos-relative">
            <div className="pos-absolute pos-top-right d-lg-none">
              <a className="d-inline-block text-danger m-3" href="javascript:void(0)" data-toggle="layout" data-action="sidebar_close">
                <i className="fa fa-times"></i>
              </a>
            </div>
            <div className="mb-3">
              <h1 className="font-size-lg font-w700 mb-2">
                <Link to={`/books/${book.id}`}>{book.title}</Link>
              </h1>
              <div className="font-size-sm font-w600 text-muted"><Link to={`/authors/${book.authorId}`}>{book.authorName}</Link></div>
            </div>
            <ul className="nav-main">
              <ChaptersMenu bookId={book.id} selectedChapter={chapter.id} />
              <li className="nav-main-item">
                <a className="nav-main-link" href="#section-updating" data-toggle="scroll-to" data-offset="50">
                  <i className="nav-main-link-icon fa fa-arrow-up text-primary"></i>
                  <span className="nav-main-link-name">Updating</span>
                </a>
              </li>
              <li className="nav-main-heading">Intro</li>
              <li className="nav-main-item">
                <a className="nav-main-link" href="#section-package" data-toggle="scroll-to" data-offset="50">
                  <i className="nav-main-link-icon fa fa-briefcase text-muted"></i>
                  <span className="nav-main-link-name">Package</span>
                </a>
              </li>
              <li className="nav-main-item">
                <a className="nav-main-link" href="#section-bootstrap" data-toggle="scroll-to" data-offset="50">
                  <i className="nav-main-link-icon fa fa-rocket text-muted"></i>
                  <span className="nav-main-link-name">Bootstrap</span>
                </a>
              </li>
              <li className="nav-main-item">
                <a className="nav-main-link" href="#section-gulp" data-toggle="scroll-to" data-offset="50">
                  <i className="nav-main-link-icon fa fa-cogs text-muted"></i>
                  <span className="nav-main-link-name">Gulp Tasks</span>
                </a>
              </li>
              <li className="nav-main-heading">Structure</li>
              <li className="nav-main-item">
                <a className="nav-main-link" href="#section-html" data-toggle="scroll-to" data-offset="50">
                  <i className="nav-main-link-icon fa fa-code text-info"></i>
                  <span className="nav-main-link-name">HTML</span>
                </a>
              </li>
              <li className="nav-main-item">
                <a className="nav-main-link" href="#section-sass" data-toggle="scroll-to" data-offset="50">
                  <i className="nav-main-link-icon fa fa-code text-info"></i>
                  <span className="nav-main-link-name">Sass</span>
                </a>
              </li>
              <li className="nav-main-item">
                <a className="nav-main-link" href="#section-javascript" data-toggle="scroll-to" data-offset="50">
                  <i className="nav-main-link-icon fa fa-code text-info"></i>
                  <span className="nav-main-link-name">JavaScript</span>
                </a>
              </li>
              <li className="nav-main-heading">More</li>
              <li className="nav-main-item">
                <a className="nav-main-link" href="#section-tips" data-toggle="scroll-to" data-offset="50">
                  <i className="nav-main-link-icon fa fa-thumbs-up text-warning"></i>
                  <span className="nav-main-link-name">Quick Tips</span>
                </a>
              </li>
              <li className="nav-main-item">
                <a className="nav-main-link" href="#section-credits" data-toggle="scroll-to" data-offset="50">
                  <i className="nav-main-link-icon fa fa-link text-warning"></i>
                  <span className="nav-main-link-name">Credits</span>
                </a>
              </li>
              <li className="nav-main-heading">Pixelcave</li>
              <li className="nav-main-item">
                <a className="nav-main-link" href="#section-thankyou" data-toggle="scroll-to" data-offset="50">
                  <i className="nav-main-link-icon fa fa-heart text-danger"></i>
                  <span className="nav-main-link-name">Thank you</span>
                </a>
              </li>
              <li className="nav-main-item">
                <a className="nav-main-link" href="https://pixelcave.com">
                  <i className="nav-main-link-icon fa fa-globe text-danger"></i>
                  <span className="nav-main-link-name">pixelcave.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
  render() {
    const { isError, isEditing, contents, book, saving, isLoadingContents, isLoading, bookId, chapter, chapterId, font, fontSize, contextRef, sidebarOpen } = this.state;

    if (isError) {
      return <ErrorPlaceholder fullWidth={true}
        message={this.props.intl.formatMessage({ id: 'chapter.messages.error.loading' })}
        icon="file alternate outline"
        showButton={true}
        buttonText={this.props.intl.formatMessage({ id: 'action.retry' })}
        buttonAction={this.reload.bind(this)} />
    }

    if (isLoadingContents || isLoading) {
      return <Loading fullWidth={true} />;
    }
    var header = null;
    if (chapter) {
      header = <h2 className="chapter__title text-center" >{chapter.title}</h2>
    }
    if (contents) {
      var display;
      if (isEditing) {
        display = <ChapterContentEditor contents={contents.contents} onChange={this.onContentChange} />
      } else {
        display = (<Reader contents={contents.contents} isLoading={isLoadingContents} />);
      }

      return (
        <div id="page-container" className={`side-scroll side-trans-enabled ${sidebarOpen ? 'sidebar-o' : null}`}>
          {this.renderSideBar()}
          <main id="main-container">
            <div className="pos-fixed pos-ontop-content d-print-none">
              <button type="button" className="btn btn-light pos-absolute pos-top-left m-1 m-lg-3"
                onClick={this.toggleSidebar.bind(this)}>
                <i className="fa fa-bars"></i>
              </button>
            </div>
          </main>
          {/* <ChapterReaderStyle font={font} size={fontSize} />
          <Sticky active context={contextRef}>
            <Menu fixed='top' style={fixedMenuStyle}>
              {book ? (<Menu.Item as={Link} to={`/books/${bookId}`}>
                <Icon name="book" /> {book.title}
              </Menu.Item>) : null}
              
              <FontsMenu onFontChanged={this.changeFont} />
              <FontsSizeMenu onFontSizeChanged={this.changeFontSize} />
              {this.renderEditMenu(chapter, contents, isEditing)}
            </Menu>
          </Sticky> */}
          <Container fluid className="chapter__contents">
            {header}
            {display}
          </Container>
          <Dimmer active={saving} page>
            <Header as='h2' icon inverted>
              <Icon name="save" />
              Saving...
            </Header>
          </Dimmer>
        </div>
      )
    } else {
      return null;
    }
  }
}

export default injectIntl(Chapter);