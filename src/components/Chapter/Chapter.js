import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import ApiService from '../../services/ApiService';
import Reader from '../Reader/Reader';
import { Menu, Icon, Container, Sticky, Confirm } from 'semantic-ui-react';
import FontsSizeMenu from '../Reader/FontsSizeMenu';
import FontsMenu from '../Reader/FontsMenu';
import ChaptersMenu from './ChaptersMenu';
import ErrorPlaceholder from '../Common/ErrorPlaceholder';
import ChapterContentEditor from './ChapterContentEditor';

const gotoTop = () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

const ChapterReaderStyle = ({ font, size }) => {
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
      font-family: '${font}' !important;
      /*border-bottom: 1px solid $gray-border;*/
    }
  
    .chapter__contents
    {
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
  )
}

class Chapter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookId: null,
      chapterId: null,
      contents: null,
      isLoading: false,
      isLoadingContents: false,
      isError: false,
      fullscreen: false,
      isEditing: false,
      fontSize: '',
      theme: localStorage.getItem('reader.theme') || 'default',
      font: '',
      dirty: false,
      saving: false
    };

    this.changeFontSize = this.changeFontSize.bind(this);
    this.changeFont = this.changeFont.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
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

  componentWillUnmount() {
    document.body.classList.remove('no-scroll')
  }

  async componentWillReceiveProps(nextProps) {
    const {
      match: { params },
    } = nextProps

    await this.loadData(params.id, params.chapterId);
  }

  async reload(){
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
      var contents = await ApiService.getChapterContents(bookId, chapterId);
      var chapter = await ApiService.getChapter(bookId, chapterId);

      this.setState({
        isLoading: false,
        isLoadingContents: false,
        contents: contents,
        chapter: chapter,
      });
    }
    catch (e) {
      console.log('e', e)
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

  onEdit(){
    this.setState({
      isEditing : true,
      dirty : false
    })
  }

  onContentChange(contents){
    var oldContents = {...this.state.contents}
    oldContents.contents = contents;

    this.setState({
      dirty : true,
      contents : oldContents
    })
  }

  async onSave(){
    this.setState({
      saving : true
    })
    try{
      const {chapter, contents} = this.state;
      const updateLink = contents.links.update;
      const createLink = chapter.links.add_contents;
      if (updateLink) {
        await ApiService.put(updateLink, JSON.stringify(contents.contents));
      }
      else if (createLink){
        await ApiService.post(createLink, JSON.stringify(contents.contents));
      }
      this.setState({
        dirty : false,
        saving:false
      })
    }
    catch(e){
      this.setState({
        saving:false
      })
    }    
  }

  onCloseEdit(){
    this.setState({
      isEditing : false,
      dirty : false
    })
  }

  renderEditMenu() {
    const { contents, isEditing } = this.state;

    if (!contents) return null;

    const editLink = contents.links.update;
    if (editLink) {
      if (isEditing)
      {
        return [<Menu.Item color="green" content={this.props.intl.formatMessage({ id: 'action.save' })} icon="save" onClick={this.onSave} />,
          <Menu.Item color="orange" content={this.props.intl.formatMessage({ id: 'action.close' })} icon="close" onClick={this.onCloseEdit} />];  
      }
      
      return (<Menu.Item color="blue" content={this.props.intl.formatMessage({ id: 'action.edit' })} icon="edit" onClick={this.onEdit} />);
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

  renderFullscreen() {
    const { fullscreen } = this.state
    if (fullscreen) {
      return <Menu.Item as='a' icon="compress" position='right'
        text={this.props.intl.formatMessage({ id: 'chapter.toolbar.fullScreen' })}
        onClick={this.toggleFullscreen} />
    } else {
      return <Menu.Item as='a' icon="expand" position='right'
        text={this.props.intl.formatMessage({ id: 'chapter.toolbar.exitFullScreen' })}
        onClick={this.toggleFullscreen} />
    }
  }

  handleContextRef = contextRef => this.setState({ contextRef })

  render() {
    const { isError, isEditing, contents, isLoadingContents, bookId, chapter, chapterId, fullscreen, font, fontSize, contextRef } = this.state;

    if (isError){
      return <ErrorPlaceholder 
              message={this.props.intl.formatMessage({ id : 'chapter.messages.error.loading' })} 
              icon="file alternate outline"
              showButton={true} 
              buttonText={this.props.intl.formatMessage({ id: 'action.retry' })} 
              buttonAction={this.reload.bind(this)}/>
    } 
    var header = null;
    if (chapter) {
      header = <h2 className="chapter__title" >{chapter.title}</h2>
    }
    if (contents) {
      var display;
      if (isEditing){
          display = <ChapterContentEditor contents={contents.contents} onChange={this.onContentChange}/>
      } else {
          display = (<Reader contents={contents.contents} isLoading={isLoadingContents} />);
      }
      return (
        <>
          <ChapterReaderStyle font={font} size={fontSize} />
          <div className={`chapter chapter${fullscreen ? "--fullscreen" : ""}`} ref={this.handleContextRef}>
            <Sticky active={fullscreen} context={contextRef}>
              <Menu>
                <Menu.Item as={Link} to={`/books/${bookId}`}>
                  <Icon name="book" />
                  <FormattedMessage id="chapter.toolbar.backToBook" />
                </Menu.Item>
                <ChaptersMenu bookId={bookId} selectedChapter={chapterId} />
                <FontsMenu onFontChanged={this.changeFont} />
                <FontsSizeMenu onFontSizeChanged={this.changeFontSize} />
                {this.renderEditMenu()}
                {this.renderFullscreen()}
              </Menu>
            </Sticky>
            <Container fluid className="chapter__contents">
              {header}
              {display}
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