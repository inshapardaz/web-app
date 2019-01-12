import React from 'react';
import { connect } from 'react-redux';

import { List, Icon, Button } from 'antd';
import { Link } from 'react-router-dom';

import EditChapter from './EditChapter.jsx';
import DeleteChapter from './DeleteChapter.jsx';
import './style.scss';

import ApiService from '../../services/api';
import rel from '../../utils/rel';

class ChapterList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingChapters: true,
      isErrorLoadingChapters: false,
      addNewChapter: false,
      showChapterEdit: false,
      showChapterDelete: false,
      selectedChapter: null,
      chapters: { items: [] }
    }
  }

  componentWillMount() {
    const { book } = this.props;

    if (book) {
      this.loadChapters(book.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { book } = nextProps;

    if (book) {
      this.loadChapters(book.id);
    }
  }

  reloadChapters() {
    const { book } = this.props;

    this.setState({ showChapterEdit: false, addNewChapter: false });

    if (book) {
      this.loadChapters(book.id);
    }
  }

  loadChapters(id) {
    this.setState({
      isLoadingChapters: true,
    });

    const api = new ApiService(this.props.user);
    api.getChapters(id)
      .then(
        (result) => {
          this.setState({
            isLoadingChapters: false,
            isErrorLoadingChapters: false,
            chapters: result
          });
        },
        () => {
          this.setState({
            isLoadingChapters: false,
            isErrorLoadingChapters: true
          });
        }
      )

    this.setState({
      isLoadingChapters: false
    });
  }

  addChapter() {
    this.setState({
      showChapterEdit: true,
      addNewChapter: true,
      selectedChapter: {}
    })
  }

  editChapter(chapter) {
    this.setState({
      showChapterEdit: true,
      addNewChapter: false,
      selectedChapter: chapter
    })
  }

  onDeleteChapter(chapter) {
    this.setState({
      showChapterDelete: true,
      selectedChapter: chapter
    })
  }

  getChapterActions(chapter) {
    var actions = [];

    const editChapter = rel(chapter.links, 'update');
    const deleteChapter = rel(chapter.links, 'delete');
    const addChapterContents = rel(chapter.links, 'add-contents');

    if (deleteChapter) {
      actions.push(<Icon type="delete" style={{color : '#fb434a' }} onClick={() => this.onDeleteChapter(chapter)} />)
    }

    if (editChapter) {
      actions.push(<Icon type="edit" style={{color : '#0072d6' }} onClick={() => this.editChapter(chapter)} />)
    }

    if (addChapterContents || editChapter) {
      actions.push(
        <Link to={`/books/${chapter.bookId}/chapters/${chapter.id}/edit`}>
          <Icon type="form" style={{color : '#f2a654' }} />
        </Link>);
    }

    return actions;
  }

  renderChapterEdit() {
    if (this.state.showChapterEdit) {
      const { chapters, addNewChapter, selectedChapter } = this.state;
      if (chapters) {
        const createLink = rel(chapters.links, 'create');
        return (
          <EditChapter chapter={selectedChapter}
            visible={true}
            createNew={addNewChapter}
            createLink={createLink}
            onCancel={() => this.setState({ showChapterEdit: false, addNewChapter: false })}
            onOk={() => this.reloadChapters()} />
        );
      }
    }

    return null;
  }

  renderChapterDelete() {
    if (this.state.showChapterDelete) {
      return (
        <DeleteChapter chapter={this.state.selectedChapter}
          onOk={() => this.reloadChapters()}
          onCancel={() => this.setState({ showChapterDelete: false })} />
      );
    }

    return null;
  }

  renderChapterFooter() {
    const { chapters } = this.state;

    if (chapters) {
      const createLink = rel(chapters.links, 'create');
      if (createLink) {
        return (<Button onClick={() => this.addChapter()}>مضمون کا اضافہ کریں</Button>);
      }
    }
    return null;
  }

  render() {
    const { isLoadingChapters, chapters } = this.state;

    return (
      <div>
        <List
          size="large"
          header={<h3 className="chapterTitle">فہرست</h3>}
          footer={this.renderChapterFooter()}
          locale={{ emptyText: 'کوئی مضمون موجود نہیں' }}
          loading={isLoadingChapters}
          dataSource={chapters.items}
          renderItem={chapter => (
            <List.Item actions={this.getChapterActions(chapter)}>
              <Link to={`/books/${chapter.bookId}/chapters/${chapter.id}`}>
                {chapter.chapterNumber}. {chapter.title}
              </Link>
            </List.Item>)
          }
        />
        {this.renderChapterEdit()}
        {this.renderChapterDelete()}
      </div>);
  }
}

export default connect(
  state => ({
    user: state.oidc.user
  }), null)(ChapterList);
