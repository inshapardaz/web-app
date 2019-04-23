import React, { Component } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl';
import ApiService from '../../services/ApiService';
import Reader from '../Reader/Reader';
import { Menu, Icon, Container, Sticky, Dimmer, Header, Loader } from 'semantic-ui-react';
import { success, error } from '../../services/toasts';
import ErrorPlaceholder from '../Common/ErrorPlaceholder';
import ChapterContentEditor from './ChapterContentEditor';
import Loading from '../Common/Loading';

import ChapterSidebar from './ChapterSidebar';

const gotoTop = () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

const ChapterReaderStyle = ({ font, size }) => {
  return (
    <style>{`
    .burgerMenu {
      position: fixed;
      z-index: 1032;
    }

    .burgerMenu__button{
      top: 0;
      left: 0;
      position: absolute;
      cursor: pointer;
      margin: .25rem!important;
      opacity: .25;
    }

    .burgerMenu__button:hover{
      opacity: 1;
    }

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
    }
  
    .chapter__contents,
    .chapter__contents span,
    .chapter__contents a, 
    .chapter__contents p,
    .chapter__contents h1, 
    .chapter__contents h2, 
    .chapter__contents h3, 
    .chapter__contents h4, 
    .chapter__contents h5, 
    .chapter__contents h6
    {
      font-family: '${font}' !important;
      font-size: ${size} !important
    }
  `}</style>
  )
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

  toggleSidebarCompact(){
    this.setState(prevState => ({
      sidebarOpenCompact: !prevState.sidebarOpenCompact
    }));
  }

  sidebarOpen() {
    this.setState({
      sidebarOpen: true
    });
  }
  sidebarClosed() {
    this.setState({
      sidebarOpen: false,
      sidebarOpenCompact: false
    });
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

  render() {
    const { isError, isEditing, contents, book, saving, isLoadingContents, isLoading, chapter, font, fontSize, sidebarOpen, sidebarOpenCompact } = this.state;

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
        display = (
          <div className="block">
            <div className="block-content chapter__contents">
              <Reader contents={contents.contents} isLoading={isLoadingContents} />
            </div>
          </div>);
      }

      var className = "sidebar-dark side-scroll page-header-fixed page-header-dark";
      if (sidebarOpen){
          className = className + " sidebar-o";
      }

      if (sidebarOpenCompact){
          className = className + " sidebar-o-xs";
      }

      return (
        <div id="page-container" className={className}>
          <ChapterReaderStyle font={font} size={fontSize} />
          <ChapterSidebar book={book} selectedChapter={chapter} onClose={this.sidebarClosed.bind(this)}
            onChangeFont={this.changeFont} onChangeFontSize={this.changeFontSize} />
          <div className="burgerMenu">
            <button type="button" className="btn btn-light burgerMenu__button d-none d-lg-inline-block"
              onClick={this.toggleSidebar.bind(this)}>
              <i className="fa fa-bars"></i>
            </button>
            { (sidebarOpenCompact) ? null : (
              <button type="button" className="btn btn-light burgerMenu__button d-lg-none"
                onClick={this.toggleSidebarCompact.bind(this)}>
                <i className="fa fa-bars"></i>
              </button>
            )}
          </div>
          {/* {this.renderEditMenu(chapter, contents, isEditing)} */}
          {header}
          {display}
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