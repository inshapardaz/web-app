import React from 'react';
import { connect } from 'react-redux';

import Page from '../Layout/Page.jsx';
import { Helmet } from 'react-helmet'
import ApiService from '../../services/api';
import rel from '../../utils/rel';
import { Input, Button, Icon } from 'antd';
import { success, error } from '../../utils/notifications';

import './style.scss';

const { TextArea } = Input;
const ButtonGroup = Button.Group;

class ChapterEditor extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isError: false,
      chapter: {title: ''},
      chapterContents: {contents : ''},
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

  loadChapterContents(bookId, chapterId){
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
          contents : ''
        });
      }
    )
  }

  saveContents(){
    const {chapter, contents, chapterContents } = this.state;

    const api = new ApiService(this.props.user);
    const updateLink = rel(chapterContents.links, 'update');
    const createLink = rel(chapter.links, 'add-contents');
    console.log(chapter)
    if (updateLink){
      api.put(updateLink, JSON.stringify(contents))
      .then(
        (result) => {
          this.setState({
            isLoading: false,
            isError: false
          });
          success('متن کی تبدیلی', `متن میں تبدیلی محفوظ کر دی گئی ہے`);
        },
        () => {
          this.setState({
            isLoading: false,
            isError: true
          });
          error('متن کی تبدیلی', `متن میں تبدیلی محفوظ نہیں کی جا سکی ہے`);
        }
      )
    } else if (createLink){
      api.post(createLink, JSON.stringify(contents))
      .then(
        (result) => {
          this.setState({
            isLoading: false,
            isError: false
          });
        },
        () => {
          this.setState({
            isLoading: false,
            isError: true
          });
        }
      )
    }
  }

  onChange(e) {
    var val = e.target.value;
    this.setState({
      contents: val
    });
  }

  render(){
    const { isLoading, chapter, contents } = this.state;

    return (
      <Page isLoading={isLoading}>
        <Helmet title={`${chapter.title} کی تدوین`} />
        <ButtonGroup >
            <Button onClick={this.saveContents.bind(this)} ><Icon type="save" />محفوظ کریں</Button>
        </ButtonGroup>
        <TextArea className="chapterEditor" rows={50}
              onChange={this.onChange.bind(this)}
              value={contents} />
      </Page>);
  }
}

export default connect(
  state => ({
    user: state.oidc.user
  }), null)(ChapterEditor);
