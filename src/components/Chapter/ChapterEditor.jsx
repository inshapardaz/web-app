import React from 'react';
import Page from '../Layout/Page.jsx';
import { Helmet } from 'react-helmet'
import ApiService from '../../services/api';

import { Input } from 'antd';

const { TextArea } = Input;

class ChapterEditor extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isError: false,
      chapter: {title: ''},
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
            contents: result
          });
          this.loadChapterContents(result);
        },
        (error) => {
          this.setState({
            isLoading: false,
            isError: true
          });
        }
      );

  }

  loadChapterContents(bookId, chapterId){
    api.getChapterContents(bookId, chapterId)
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
  }

  render(){
    const { isLoading, chapter } = this.state;

    return (
      <Page isLoading={isLoading}>
        <Helmet title={`${chapter.title} کی تدوین`} />

        <TextArea rows={50} />
      </Page>);
  }
}

export default ChapterEditor;
