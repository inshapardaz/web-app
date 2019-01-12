import React from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
import Page from '../Layout/Page.jsx';
import { Helmet } from 'react-helmet'
import ApiService from '../../services/api';
import rel from '../../utils/rel';
import { Input, Button, Icon, Menu, message } from 'antd';
import Reader from '../Reader/Reader.jsx';

import './style.scss';

const { TextArea } = Input;
const ButtonGroup = Button.Group;

class ChapterEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullscreen: false,
      preview: false,
      isLoading: false,
      isError: false,
      chapter: { title: '' },
      chapterContents: { contents: '' },
      contents: ''
    }
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props
    this.loadChapter(params.id, params.chapterId);
  }

  componentWillReceiveProps(nextProps) {
    const {
      match: { params },
    } = nextProps
    this.loadChapter(params.id, params.chapterId);
  }

  loadChapter(bookId, chapterId) {
    this.setState({
      bookId: bookId,
      isLoading: true,
    });
    const api = new ApiService(this.props.user);
    api.getChapter(bookId, chapterId)
      .then(
        (result) => {
          this.setState({
            isLoading: false,
            chapter: result
          });
          this.loadChapterContents(bookId, chapterId);
        },
        (error) => {
          this.setState({
            isLoading: false,
            isError: true
          });
        }
      );

  }

  loadChapterContents(bookId, chapterId) {
    const api = new ApiService(this.props.user);
    api.getChapterContents(bookId, chapterId)
      .then(
        (result) => {
          this.setState({
            isLoading: false,
            chapterContents: result,
            contents: result.contents
          });
        },
        (error) => {
          this.setState({
            isLoading: false,
            isError: true,
            contents: ''
          });
        }
      )
  }

  saveContents() {
    const { chapter, contents, chapterContents } = this.state;

    const api = new ApiService(this.props.user);
    const updateLink = rel(chapterContents.links, 'update');
    const createLink = rel(chapter.links, 'add-contents');

    if (updateLink) {
      api.put(updateLink, JSON.stringify(contents))
        .then(res => {
          message.success(`متن میں تبدیلی محفوظ کر دی گئی ہے`);
          this.setState({
            isLoading: false,
            isError: false
          });
        }, e => {
          message.error(`متن میں تبدیلی محفوظ نہیں کی جا سکی ہے`);
          this.setState({
            isLoading: false,
            isError: true
          });
        }
        )
    } else if (createLink) {
      api.post(createLink, JSON.stringify(contents))
        .then(res => {
          message.success(`متن میں تبدیلی محفوظ کر دی گئی ہے`);
          this.setState({
            isLoading: false,
            isError: false
          });
        }, e => {
          message.error(`متن میں تبدیلی محفوظ نہیں کی جا سکی ہے`);
          this.setState({
            isLoading: false,
            isError: true
          });
        }
        )
    }
  }

  toggleFullscreen() {
    this.setState(prevState => ({
      fullscreen: !prevState.fullscreen
    }));

    if (this.state.fullscreen)
      document.body.classList.remove('no-scroll')
    else
      document.body.classList.add('no-scroll')
  }

  togglePreview() {
    this.setState(prevState => ({
      preview: !prevState.preview
    }));
  }

  onChange(e) {
    var val = e.target.value;
    this.setState({
      contents: val
    });
  }

  renderEditor(preview, contents) {
    if (preview) {
      return (<Reader contents={contents} />);
    } else {
      return (<TextArea className="chapterEditor" rows={30}
        onChange={this.onChange.bind(this)}
        value={contents} />);
    }
  }

  render() {
    const { isLoading, chapter, contents, fullscreen, preview } = this.state;

    return (
      <Page isLoading={isLoading}>
        <Helmet title={`${chapter.title} کی تدوین`} />
        <div className={`chapter${fullscreen ? '--fullscreen' : ''}`}>
          <Menu mode="horizontal">
            <Menu.Item>
              <Link to={`/books/${chapter.bookId}`}><Icon type="book" />کتاب</Link>
            </Menu.Item>
            <Menu.Item onClick={this.saveContents.bind(this)} >
              <Icon type="save" />محفوظ کریں
          </Menu.Item>
            {!preview &&
              <Menu.Item onClick={this.togglePreview.bind(this)}>
                <Icon type="eye" />پیش نظارہ
            </Menu.Item>}

            {preview &&
              <Menu.Item onClick={this.togglePreview.bind(this)}>
                <Icon type="form" />پیش نظارہ سے اخراج
            </Menu.Item>}

            {!fullscreen &&
              <Menu.Item onClick={this.toggleFullscreen.bind(this)}>
                <Icon type="fullscreen" />فُل سکرین
            </Menu.Item>}

            {fullscreen &&
              <Menu.Item onClick={this.toggleFullscreen.bind(this)}>
                <Icon type="fullscreen-exit" />فُل سکرین سے اخراج
            </Menu.Item>}
          </Menu>

          {this.renderEditor(preview, contents)}

        </div>
      </Page>);
  }
}

export default connect(
  state => ({
    user: state.oidc.user
  }), null)(ChapterEditor);
