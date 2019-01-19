import React from 'react';
import { withRouter } from 'react-router'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'

import ApiService from '../../services/api';
import Page from '../Layout/Page.jsx';
import { Helmet } from 'react-helmet'
import EditCategory from './EditCategory';
import { Button, Icon, List, Modal } from 'antd';
import { success, error } from '../../utils/notifications';
import rel from '../../utils/rel';

const confirm = Modal.confirm;

class CategoriesHome extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      isError: false,
      isLoading: true,
      categories: {items : []},
      showEditor : false,
      selectedCategory : null
    };
  }

  componentDidMount(){
    this.loadCategories();
  }

  reloadCategories(){
    this.hideEditor();
    this.loadCategories();
  }

  loadCategories() {
    this.setState({
      isLoading: true
    });

    const api = new ApiService(this.props.user);
    return api.getCategories()
      .then(
        (result) => {
          this.setState({
            isLoading: false,
            isError: false,
            categories: result
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

  onDelete(category){
    const api = new ApiService(this.props.user);
    api.delete(rel(category.links, 'delete'))
      .then(res => {
        success('زمرہ کا اخراج', `${category.name} کو خارج کر دیا گیا ہیں؟`);
        this.reloadCategories();
      }, (e) => {
        error('زمرہ کا اخراج', `${category.name} کو خارج نہیں کیا جا سکا؟`);
      });
  }


  showNew(){
    this.setState({
      selectedCategory : {},
      showEditor : true,
      isAdding: true
    })
  }

  showEdit(category){
    this.setState({
      selectedCategory : category,
      showEditor : true,
      isAdding: false
    })
  }

  showDelete(category){
    confirm({
      title: `کیا آپ ${category.name} کو خارج کرنا چاہتے ہیں؟`,
      okText: 'جی ہاں',
      okType: 'danger',
      cancelText: 'نہیں',
      onOk : this.onDelete.bind(this, category)
    });
  }

  hideEditor(){
    this.setState({
      showEditor: false
    })
  }

  renderActions(category){
    let actions = [];
    const editLink = rel(category.links, 'update');
    const deleteLink = rel(category.links, 'delete');

    if (deleteLink) {
      actions.push(<Icon type="delete" onClick={() => this.showDelete(category)} />)
    }
    if (editLink) {
      actions.push(<Icon type="edit" onClick={() => this.showEdit(category)} />)
    }
    return actions;
  }

  render(){
    const { categories, isLoading } = this.state;
    const createLink = (categories && categories.links) ? rel(categories.links, 'create') : null;

    return (
      <Page {...this.props} title="زمرہ جات" isLoading={isLoading} actions={
        createLink && <Button type="primary" onClick={() => this.showNew()}>
          نیا زمرہ <Icon type="plus" />
        </Button>
      }>
        <Helmet title="زمرہ جات" />
        <List
          size="large"
          bordered
          dataSource={categories.items}
          renderItem={item => (
          <List.Item key={item.is} actions={this.renderActions(item)}>
            <Link to={`/books?category=${item.id}`}>
              {item.name}
            </Link>
          </List.Item>)}
        />
        <EditCategory category={this.state.selectedCategory}
                      visible={this.state.showEditor}
                      createNew={this.state.isAdding}
                      createLink={createLink}
                      onCancel={this.hideEditor.bind(this)}
                      onOk={this.reloadCategories.bind(this)} />
      </Page>
    );
  }
}

export default withRouter(connect(
  state => ({
    user: state.oidc.user
  }), null)(CategoriesHome));
