import React, { Component } from 'react'
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import ApiService from '../../services/ApiService';
import Reader from '../Reader/Reader';

import { BackTop, PageHeader, Anchor, Button, Layout } from 'antd';

import { success, error } from '../../services/toasts';
import ErrorPlaceholder from '../Common/ErrorPlaceholder';
import Loading from '../Common/Loading';

import ChapterSidebar from './ChapterSidebar';

const { Content } = Layout;
const gotoTop = () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

const ChapterReaderStyle = () => {
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
      dirty: false,
      saving: false
    };

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

  renderEditMenu() {
    const { contents, chapter } = this.state;

    const hasEditLink = contents && 
                     contents.links && 
                     (chapter.links.add_contents || chapter.links.update_contents);

    if (hasEditLink) {
      return <Link to={`/books/${chapter.bookId}/chapters/${chapter.id}/edit`}><Button icon="edit"></Button></Link>
    }

    return null;
  }

  handleContextRef = contextRef => this.setState({ contextRef })

  render() {
    const { isError, contents, book, isLoadingContents, isLoading, chapter } = this.state;

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

    if (contents) {
      const display = (
        <Content style={{ padding: '10px' }}>
            <Reader contents={contents.contents} isLoading={isLoadingContents} />
        </Content>);

      const extra = (<>
        {this.renderEditMenu()}
        <ChapterSidebar book={book} selectedChapter={chapter} />
      </>);
      return (
        <div id="page-container">
          <Anchor affix>
            <PageHeader title={book.title}
              subTitle={chapter.title}
              onBack={() => window.history.back()}
              extra={extra} />
          </Anchor>
          <ChapterReaderStyle />
          {display}
          <BackTop />
        </div>
      )
    } else {
      return null;
    }
  }
}

export default injectIntl(Chapter);