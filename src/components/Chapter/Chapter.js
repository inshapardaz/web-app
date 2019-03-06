import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import ApiService from '../../services/ApiService';
import Reader from '../Reader/Reader';
import { Header, Menu, Icon, Container } from 'semantic-ui-react';
import FontsSizeMenu from '../Reader/FontsSizeMenu';
import FontsMenu from '../Reader/FontsMenu';
import ChaptersMenu from './ChaptersMenu';


const ChapterReaderStyle = ({font, size}) => {
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
      /*border-bottom: 1px solid $gray-border;*/
    }
  
    .chapter__contents
    {
      max-width: 700px;
      margin: auto;
      padding: 10px;
      font-family: '${font}' !important;
      font-size: ${size} !important
    }
  
    .chapter--fullscreen
    {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: white;
      z-index: 1000;
      overflow-y: scroll;
    }
  `}</style>
)}

class Chapter extends Component {
  constructor(props){
    super(props);
    this.state = {
      bookId: null,
      chapterId: null,
      contents: null,
      isLoading: false,
      isLoadingContents: false,
      isError: false,
      fullscreen: false,
      fontSize: '',
      theme: localStorage.getItem('reader.theme') || 'default',
      font: ''
    };

    this.changeFontSize = this.changeFontSize.bind(this);
    this.changeFont = this.changeFont.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
  }
  
  async componentDidMount() {
    const {
      match: { params },
    } = this.props
    
    await this.loadData(params.id, params.chapterId);
  }

  componentWillUnmount() {
    document.body.classList.remove('no-scroll')
  }

  async componentWillReceiveProps(nextProps) {
    const {
      match: { params },
    } = nextProps
    
    await this.loadData(params.id, params.chapterId);
  }

  async loadData(bookId, chapterId) {
    this.setState({
      bookId: bookId,
      chapterId: chapterId,
      isLoading: true,
      isLoadingContents: true
    });

    try {
      var contents = await ApiService.getChapterContents(bookId, chapterId);
      var chapter = await ApiService.getChapter(bookId, chapterId);

      this.setState({
        isLoading: false,
        isLoadingContents: false,
        contents: contents,
        chapter: chapter,
      });
    }
    catch (e){
      this.setState({
        isLoading: false,
        isLoadingContents: false,
        isError: true
      });
    }
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

  renderEditLink() {
    const { bookId, contents} = this.state;

    if (!contents) return null;

    const editLink = contents.links.update;
    if (editLink) {
      return (<Menu.Item as={Link} content={this.props.intl.formatMessage({id:'action.edit'})}
      to={`/books/${bookId}/chapters/${contents.chapterId}/edit`} icon="edit" />);
    }
    return null;
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

   renderFullscreen(){
    const { fullscreen } = this.state
    if (fullscreen){
        return  <Menu.Item as='a' icon="compress" position='right' 
                          text={this.props.intl.formatMessage({id:'chapter.toolbar.fullScreen'})} 
                          onClick={this.toggleFullscreen}/>
    } else {
        return <Menu.Item as='a' icon="expand" position='right' 
                          text={this.props.intl.formatMessage({id:'chapter.toolbar.exitFullScreen'})} 
                          onClick={this.toggleFullscreen}/>
    }
  }

  render() {
    const { contents, isLoadingContents, bookId, chapter, chapterId, fullscreen, font, fontSize } = this.state;
    var header = null;
    if (chapter) {
      header = <Header as="h2" textAlign="center" content={chapter.title} className="chapter__title" />
    }
    if (contents){
      return (
        <>
          <ChapterReaderStyle font={font} size={fontSize} />
          <div className={`chapter chapter${fullscreen?"--fullscreen":""}`}>
            <Menu>
                <Menu.Item as={Link} to={`/books/${bookId}`}>
                  <Icon name="book"/>
                  <FormattedMessage id="chapter.toolbar.backToBook" />
                </Menu.Item>
                {this.renderEditLink()}
                <ChaptersMenu bookId={bookId} selectedChapter={chapterId} />
                <FontsMenu onFontChanged={this.changeFont} />
                <FontsSizeMenu onFontSizeChanged={this.changeFontSize} />
                {this.renderFullscreen()}                     
            </Menu>
            <Container text className="chapter__contents">
              {header}
              <Reader contents={contents.contents} isLoading={isLoadingContents} />
            </Container>
          </div>
        </>
      )
    } else {
      return null;
    }
  }
}

export default injectIntl(Chapter);