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
      fullscreen: false,
      fontSize: localStorage.getItem('reader.fontSize')||'100%',
      theme: localStorage.getItem('reader.theme')||'default',
      font: localStorage.getItem('reader.font')||''
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
  changeFontSize(e)
  {
    this.setState({
      fontSize: e.key
    });

    localStorage.setItem('reader.fontSize', e.key);
  }

  changeTheme(e)
  {
    this.setState({
      theme: e.key
    });
    localStorage.setItem('reader.theme', e.key);
  }

  changeFont(e)
  {
    this.setState({
      font: e.key
    });

    localStorage.setItem('reader.font', e.key);
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

  render() {
    const { bookId, chapter, chapters, contents, fullscreen, fontSize, theme, font } = this.state;

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
        <div className={`chapter${fullscreen?'--fullscreen': ''} chapter__theme--${theme}`}>
          <Menu mode="horizontal" theme={theme === 'dark' ? 'dark' : ''}>
            <Menu.Item>
              <Link to={`/books/${bookId}`}><Icon type="book" />View Book</Link>
            </Menu.Item>

            <SubMenu title={<span><Icon type="read" />Chapters</span>}>
              {chapterMenus}
            </SubMenu>

            <SubMenu title={<span><Icon type="font-size" />Theme</span>} onClick={this.changeTheme.bind(this)}>
              <Menu.Item key="default">Default</Menu.Item>
              <Menu.Item key="sepia">Sepia</Menu.Item>
              <Menu.Item key="dark">Dark</Menu.Item>
            </SubMenu>

            <SubMenu title={<span><Icon type="font-colors" />Font</span>} onClick={this.changeFont.bind(this)}>
              <Menu.Item key="">Default</Menu.Item>
              <SubMenu title="Nastaleeq">
                <Menu.Item key="Jameel Noori Nastaleeq">Jameel Noori Nastaleeq</Menu.Item>
                <Menu.Item key="Mehr-Nastaleeq">Mehr-Nastaleeq</Menu.Item>
                <Menu.Item key="Noto">Noto</Menu.Item>
                <Menu.Item key="Nafees Nastaleeq">Nafees-Nastaleeq</Menu.Item>
              </SubMenu>
              <SubMenu title="Nasakh">
              <Menu.Item key="Nafees Web Naskh">Nafees Web Naskh</Menu.Item>
                <Menu.Item key="AdobeArabic">Adobe Arabic</Menu.Item>
                <Menu.Item key="MehfilNaskh">Mehfil Naskh</Menu.Item>
                <Menu.Item key="Dubai">Dubai</Menu.Item>
                <Menu.Item key="UrduNaskhAsiatype">Urdu Naskh Asiatype</Menu.Item>
              </SubMenu>
            </SubMenu>

            <SubMenu title={<span><Icon type="font-size" />Text Size</span>} onClick={this.changeFontSize.bind(this)}>
              <Menu.Item key="80%">Small</Menu.Item>
              <Menu.Item key="100%">Medium</Menu.Item>
              <Menu.Item key="120%">Large</Menu.Item>
              <Menu.Item key="150%">Extra Large</Menu.Item>
              <Menu.Item key="170%">Huge</Menu.Item>
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
          <div className="chapter__contents" style={{fontSize: fontSize, fontFamily: font}}>
            <div className="chapter__title">{chapter && chapter.title}</div>
            <Reader contents={contents.contents} />
          </div>
        </div>
      </Page>
    );
  }
}

export default Chapter
