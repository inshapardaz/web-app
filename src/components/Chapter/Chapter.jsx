import React from 'react';
import { Link } from 'react-router-dom';
import Page from '../Layout/Page.jsx';
import { Helmet } from 'react-helmet'

import { getChapters, getChapter, getChapterContents } from '../../utils/fetchApi';

import Reader from '../Reader/Reader.jsx';

import { Menu, Icon } from 'antd';
import './style.scss';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class Chapter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      chapter: {},
      contents: '',
      chapters: [],
      fullscreen: false
    };
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props
    this.loadData(params.id, params.chapterId);
  }

  componentWillReceiveProps(nextProps) {
    const {
      match: { params },
    } = nextProps
    this.loadData(params.id, params.chapterId);
  }

  loadData(bookId, chapterId) {
    this.setState({
      bookId: bookId,
      isLoading: true,
    });
    getChapterContents(bookId, chapterId)
      .then(
        (result) => {
          this.setState({
            isLoading: false,
            contents: result
          });
        },
        (error) => {
          this.setState({
            isLoading: false,
            isError: true
          });
        }
      )
    getChapter(bookId, chapterId)
      .then(
        (result) => {
          this.setState({
            isLoading: false,
            chapter: result
          });
        },
        (error) => {
          this.setState({
            isLoading: false,
            isError: true
          });
        }
      )

    getChapters(bookId)
      .then(
        (result) => {
          this.setState({
            isLoading: false,
            chapters: result
          });
        },
        (error) => {
          this.setState({
            isLoading: false,
            isError: true
          });
        }
      )
  }
  toggleFullscreen() {
    this.setState(prevState => ({
      fullscreen: !prevState.fullscreen
    }));

    if (this.state.fullscreen)
      document.body.classList.remove('no-scroll')
    else
      document.body.classList.add('no-scroll')

    console.log(document.body.classList);
  }

  render() {
    const { bookId, chapter, chapters, contents, fullscreen } = this.state;

    let chapterMenus = [];
    if (chapters && chapters.items)
    {
      chapterMenus = chapters.items.map(c =>
        <Menu.Item key={c.id}>
          <Link to={`/books/${bookId}/chapters/${c.id}`}>{c.title}</Link>
        </Menu.Item> );
    }
    return (
      <Page>
        <Helmet title={(chapter & chapter.title) || ''} />
        <div className={`chapter${fullscreen?'--fullscreen': ''}`}>
          <Menu mode="horizontal">
            <Menu.Item>
              <Link to={`/books/${bookId}`}><Icon type="book" />View Book</Link>
            </Menu.Item>

            <SubMenu title={<span><Icon type="read" />Chapters</span>}>
              {chapterMenus}
            </SubMenu>

            {!fullscreen &&
              <Menu.Item onClick={this.toggleFullscreen.bind(this)}>
                <Icon type="fullscreen" />Fullscreen
            </Menu.Item>}

            {fullscreen &&
              <Menu.Item onClick={this.toggleFullscreen.bind(this)}>
                <Icon type="fullscreen-exit" />Exit Fullscreen
            </Menu.Item>}
          </Menu>
          <div className="chapter__contents">
            <div className="chapter__title">{chapter && chapter.title}</div>
            <Reader contents={contents.contents} />
          </div>
        </div>
      </Page>
    );
  }
}

export default Chapter
