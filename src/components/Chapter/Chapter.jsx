import React from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import Page from '../Layout/Page.jsx';
import { Helmet } from 'react-helmet'

import ApiService from '../../services/api';

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
      chapter: {title: ''},
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

  componentWillUnmount() {
    document.body.classList.remove('no-scroll')
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
    const api = new ApiService(this.props.user);
    api.getChapterContents(bookId, chapterId)
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
      );
    api.getChapter(bookId, chapterId)
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

    api.getChapters(bookId)
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
        <Helmet title={chapter.title} />
        <div className={`chapter${fullscreen?'--fullscreen': ''} chapter__theme--${theme}`}>
          <Menu mode="horizontal" theme={theme === 'dark' ? 'dark' : ''}>
            <Menu.Item>
              <Link to={`/books/${bookId}`}><Icon type="book" />کتاب</Link>
            </Menu.Item>

            <SubMenu title={<span><Icon type="read" />ابواب</span>}>
              {chapterMenus}
            </SubMenu>

            <SubMenu title={<span><Icon type="font-size" />تھیم</span>} onClick={this.changeTheme.bind(this)}>
              <Menu.Item key="default">سفید</Menu.Item>
              <Menu.Item key="sepia">سیپا</Menu.Item>
              <Menu.Item key="dark">تاریک</Menu.Item>
            </SubMenu>

            <SubMenu title={<span><Icon type="font-colors" />فونٹ</span>} onClick={this.changeFont.bind(this)}>
              <Menu.Item key="">Default</Menu.Item>
              <Menu.Item key="Segoe UI">Segoe UI</Menu.Item>
              <SubMenu title="نستعلیق">
                <Menu.Item key="Jameel Noori Nastaleeq">جمیل نوری نستعلیق</Menu.Item>
                <Menu.Item key="Mehr-Nastaleeq">مہر نستعلیق</Menu.Item>
                <Menu.Item key="Noto">نوٹو</Menu.Item>
                <Menu.Item key="Nafees Nastaleeq">نفیس نستعلیق</Menu.Item>
              </SubMenu>
              <SubMenu title="نسخ">
              <Menu.Item key="Nafees Web Naskh">نفیس نسخ</Menu.Item>
                <Menu.Item key="AdobeArabic">اڈوبی عربک</Menu.Item>
                <Menu.Item key="MehfilNaskh">محفل نسخ</Menu.Item>
                <Menu.Item key="Dubai">دبِی</Menu.Item>
                <Menu.Item key="UrduNaskhAsiatype">اردو نسخ ایشیا ٹائپ</Menu.Item>
              </SubMenu>
            </SubMenu>

            <SubMenu title={<span><Icon type="font-size" />تحریر کا سائز</span>} onClick={this.changeFontSize.bind(this)}>
              <Menu.Item key="80%">بہت چھوٹا</Menu.Item>
              <Menu.Item key="100%">چھوٹا</Menu.Item>
              <Menu.Item key="120%">درمیانہ</Menu.Item>
              <Menu.Item key="150%">بڑا</Menu.Item>
              <Menu.Item key="170%">بہت بڑا</Menu.Item>
              <Menu.Item key="200%">انتہائی بڑا</Menu.Item>
            </SubMenu>

            {!fullscreen &&
              <Menu.Item onClick={this.toggleFullscreen.bind(this)}>
                <Icon type="fullscreen" />فُل سکرین
            </Menu.Item>}

            {fullscreen &&
              <Menu.Item onClick={this.toggleFullscreen.bind(this)}>
                <Icon type="fullscreen-exit" />فُل سکرین سے اخراج
            </Menu.Item>}
          </Menu>
          <div className="chapter__contents" style={{fontSize: fontSize, fontFamily: font ? font : 'inherit'}}>
            <div className="chapter__title">{chapter && chapter.title}</div>
            <Reader contents={contents.contents} />
          </div>
        </div>
      </Page>
    );
  }
}

export default connect(
  state => ({
    user: state.oidc.user
}), null)(Chapter)
