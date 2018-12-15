import React from 'react';
import { Helmet } from 'react-helmet'
import {connect} from 'react-redux';

import {Button, Tabs, Icon, Modal, Spin } from 'antd';
import AuthorBookList from './AuthorBookList.jsx';

import ApiService from '../../services/api';

import { success, error } from '../../utils/notifications';

import Page from '../Layout/Page.jsx';
import './style.scss'
import rel from '../../utils/rel';
import Avatar from '../Avatar/Avatar.jsx'
import EditAuthor from './EditAuthor';

const TabPane = Tabs.TabPane
const confirm = Modal.confirm;

class AuthorPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isLoading : true,
      isError: false
    }
  }
  componentWillMount() {
    const {
      match: { params },
    } = this.props

    this.loadAuthor(params.id);
  }

  componentWillReceiveProps(nextProps){
    const {
      match: { params },
    } = nextProps
    this.loadAuthor(params.id);
  }

  reloadAuthor(){
    this.hideEditor();
    this.loadAuthor(this.state.authorId);
  }

  loadAuthor(id)
  {
    this.setState({
      isLoading: true,
      authorId: id
    });

    const api = new ApiService(this.props.user);
    api.getAuthor(id)
      .then(
        (result) => {
          this.setState({
            isLoading: false,
            author: result
          });
        },
        (e) => {
          console.log(e);
        this.props.history.push('/error');
        }
      )
  }

  showEdit(){
    this.setState({
      showEditor : true
    })
  }

  hideEditor(){
    this.setState({
      showEditor: false
    })
  }

  showDeleteConfirm() {
    const { author } = this.state;
    confirm({
      title: `کیا آپ ${author.name} کو خارج کرنا چاہتے ہیں؟`,
      okText: 'جی ہاں',
      okType: 'danger',
      cancelText: 'نہیں',
      onOk : this.onDelete.bind(this)
    });
  }

  onDelete(){
    const { author } = this.state;

    const api = new ApiService(this.props.user);
    api.delete(rel(author.links, 'delete'))
      .then(res => {
        success('ادیب کا اخراج', `${author.name} کو خارج کر دیا گیا ہیں؟`);
        this.props.history.push('/authors');
      }, (e) => {
        error('ادیب کا اخراج', `${author.name} کو خارج نہیں کیا جا سکا؟`);
      });
  }

  getAuthorActions(author){
    const addFavoriteLink =  rel(author.links, 'add-favorite');
    const removeFavoriteLink = rel(author.links, 'remove-favorite');
    const editAuthor = rel(author.links, 'update');
    const deleteAuthor = rel(author.links, 'delete');

    let buttons = [];

    if (addFavoriteLink){
      buttons.push(<Button key="add-favorite" ghost>
        <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" /> پسندیدہ بنایں
      </Button>);
    }

    if (removeFavoriteLink){
      buttons.push(<Button key="remove-favorite" >
        <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" /> پسندیدگی ہٹائیں
      </Button>)
    }

    if (editAuthor){
      buttons.push(<Button key="edit-author" ghost  onClick={() => this.showEdit()}>
        <Icon type="edit" /> تدوین
      </Button>)
    }

    if (deleteAuthor){
      buttons.push(<Button key="delete-author" ghost onClick={() => this.showDeleteConfirm()}>
        <Icon type="delete" /> ہٹائیں
        </Button>)
    }

    if (buttons.length > 0){
      return(
      <Button.Group size="default" className="author-actions">
        {buttons}
      </Button.Group>)
    }

    return null;
  }

  render() {
    if (!this.state)
      return null;
    const { isError, isLoading, author } = this.state;

    if (isLoading) {
      return <div className="loading">
        <Spin />
        <h3 className="loading__message">انتظار فرمائیے۔۔۔</h3>
      </div>
    }

    if (isError) {
      return <div>Error loading author. Please retry.</div>
    }

    if (!author) {
      return null
    }



    return (<Page>
      <Helmet title={author.name} />
      <div className="profile">
        <div className="row">
          <div className="col-xl-4">
            <div className="card profile__header" style={{ backgroundImage: 'url(/resources/images/bkg_3.jpeg)' }}>
              <div className="profile__header-card">
                <div className="card-body text-center">
                  <Avatar src={rel(author.links, 'image')} size="110" border="true" borderColor="white" fallback="../../resources/images/avatar1.jpg" />
                  {this.getAuthorActions(author)}
                </div>
              </div>
            </div>
            <div className="card profile__social-info">
              <div className="profile__social-name">
                <h2>
                  <span className="text-black mr-2">
                    <strong>{author.name}</strong>
                  </span>
                </h2>
              </div>
              <div className="profile__social-counts">
                <div className="text-center mr-3">
                  <h2>{author.bookCount}</h2>
                  <p className="mb-0">کتابیں</p>
                </div>
                <div className="text-center">
                  <h2>{0}</h2>
                  <p className="mb-0">مضامین</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-8">
            <div className="card">
              <div className="card-body">
                <Tabs defaultActiveKey="1">
                  <TabPane
                    tab={
                      <span>
                        <Icon type="book" /> کتابیں
                      </span>
                    }
                    key="1"
                  >
                     <AuthorBookList author={author} />
                  </TabPane>
                  <TabPane
                    tab={
                      <span>
                        <Icon type="file" /> مضامین
                      </span>
                    }
                    key="2"
                  >
                  </TabPane>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EditAuthor author={author}
                      visible={this.state.showEditor}
                      createNew={false}
                      createLink={null}
                      onCancel={this.hideEditor.bind(this)}
                      onOk={this.reloadAuthor.bind(this)} />
    </Page>);
  }
}

export default connect(
  state => ({
    user: state.oidc.user
}), null)(AuthorPage);
