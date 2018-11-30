import React from 'react';
import Page from '../Layout/Page.jsx';
import { Helmet } from 'react-helmet'

import { getChapters, getChapter, getChapterContents} from '../../utils/fetchApi';

import Reader from '../Reader/Reader.jsx';

import { Menu, Icon } from 'antd';
import './style.scss';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class Chapter extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      isLoading: false,
      chapter: {},
      contents: '',
      chapters:[]
    };
  }

  componentDidMount()
  {
    const {
      match: { params },
    } = this.props
    this.loadData(params.id, params.chapterId);
  }

  componentWillReceiveProps(nextProps){
    const {
      match: { params },
    } = nextProps
    this.loadData(params.id, params.chapterId);
  }

  loadData(bookId, chapterId)
  {
    getChapterContents(bookId, chapterId)
    .then(
      (result) => {
        this.setState({
          isLoading : false,
          contents: result
        });
      },
      (error) => {
        this.setState({
          isLoading : false,
          isError:true
        });
      }
    )
    getChapter(bookId, chapterId)
    .then(
      (result) => {
        this.setState({
          isLoading : false,
          chapter: result
        });
      },
      (error) => {
        this.setState({
          isLoading : false,
          isError:true
        });
      }
    )

    getChapters(bookId)
    .then(
      (result) => {
        this.setState({
          isLoading : false,
          chapters: result
        });
      },
      (error) => {
        this.setState({
          isLoading : false,
          isError:true
        });
      }
    )
  }

  render()
  {
    const {chapter, chapters, contents} = this.state;

    return (
      <Page>
        <Helmet title={(chapter & chapter.title) || ''} />
        <div className="chapter">
          <div className="chapter__title">{chapter && chapter.title}</div>
          <Reader contents={contents.contents} />
        </div>
      </Page>
    );
  }
}

export default Chapter
