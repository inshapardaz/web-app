import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Link} from 'react-router-dom';
import ApiService from '../../services/ApiService';
import { List, Icon, Button, Segment, Header, Confirm } from 'semantic-ui-react';
import { injectIntl, FormattedMessage } from 'react-intl';

import rel  from '../../services/rel'; 
import { error } from '../../services/toasts';

import { ErrorPlaceholder, EmptyPlaceholder, Loading }  from '../Common';
import EditCategory from './EditCategory';

class CategoriesHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isError: false,
      isLoading: true,
      categories: { items: [] },
      showEditor: false,
      selectedCategory: null,
      showEdit: false,
      confirmDelete: false
    };
  }

  componentDidMount() {
    this.loadCategories();
  }

  reloadCategories() {
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

  addCategory(){
    this.setState({
      showEdit : true
    });
  }

  onEditClicked(category){
    this.setState({
      selectedCategory: category,
      showEdit : true
    });
  }

  onCloseEdit(){
    this.setState({
      showEdit : false
    });
  }

  onDeleteClicked(category){
    this.setState({
      selectedCategory: category,
      confirmDelete: true
    });
  }

  deleteCategory(){
    console.log("deleting category");
    error("Error loading categoies");
    this.setState({
      selectedCategory: null,
      confirmDelete: false
    });
  }

  renderCategoryActions(category){
    let actions = [];
    const editLink = rel(category.links, 'update');
    const deleteLink = rel(category.links, 'delete');

    if (editLink) {
      actions.push(<Button key="edit" icon="pencil" onClick={this.onEditClicked.bind(this, category)}/>)
    }
    if (deleteLink) {
      actions.push(<Button key="delete" icon="delete" onClick={this.onDeleteClicked.bind(this, category)}/>)
    }
    
    return (<Button.Group icon>{actions}</Button.Group>);
  }

  renderCategories(categories){
    return categories.items.map(c =>
      <List.Item key={c.id}>
        <List.Content floated='right'>
          {this.renderCategoryActions(c)}
        </List.Content>
        <Icon name="folder outline"/>
        <List.Content as={Link} to={`/books?category=${c.id}`}>{c.name}</List.Content>
      </List.Item>)
  }

  renderLoadingError(){
    const message = this.props.intl.formatMessage({id: 'categories.messages.error.loading'});
    const buttonText = this.props.intl.formatMessage({id: 'action.retry'});
    return (<ErrorPlaceholder message={message}
              showButton={true} buttonText={buttonText} 
              buttonAction={this.loadCategories.bind(this)} />)
  }
  
  renderEmptyPlaceHolder(){
    const message = this.props.intl.formatMessage({id: 'categories.messages.empty'});
    const buttonText = this.props.intl.formatMessage({id: 'categories.action.create'});

    return (
      <EmptyPlaceholder message={message} iconName='folder outline'
              showButton={true} buttonText={buttonText} 
              buttonAction={this.addCategory.bind(this)} />        
    );
  }

  render() {
    const { categories, isLoading, isError, showEdit, confirmDelete, selectedCategory } = this.state;
    const createLink = (categories && categories.links) ? rel(categories.links, 'create') : null;
    const selectedCategoryName = selectedCategory ? selectedCategory.name : '';
    
    if (isLoading){
      return <Loading />;
    } else if (isError) {
      return this.renderLoadingError();
    }

    if (categories && categories.items && categories.items.length > 0)
    {
      return (
        <>
        <Header as='h2' icon='folder outline' content={<FormattedMessage id="header.categories"/>} />
        <Button onClick={this.addCategory.bind(this)} attached='top'><Icon name='add' /><FormattedMessage id="categories.action.create"/></Button>
        <Segment padded={true} attached>
          <List divided verticalAlign='middle' relaxed='very'>
            {this.renderCategories(categories)}
          </List>
        </Segment>
        <Button onClick={this.addCategory.bind(this)} attached='bottom' ><Icon name='add' /><FormattedMessage id="categories.action.create"/></Button>
        <Confirm size="mini" open={confirmDelete} 
                 content={this.props.intl.formatMessage({id: 'categories.action.confirmDelete'}, { name : selectedCategoryName })}
                 cancelButton={this.props.intl.formatMessage({id: 'action.no'})}
                 confirmButton={this.props.intl.formatMessage({id: 'action.yes'})}
                 onCancel={() => this.setState({ confirmDelete : false })} 
                 onConfirm={this.deleteCategory.bind(this)} />
          <EditCategory open={showEdit} category={selectedCategory} createLink={createLink} onClose={this.onCloseEdit.bind(this)}  />
        </>
      );
    }
    else
      return this.renderEmptyPlaceHolder();
  }
}

export default connect(
  state => ({
    user: state.oidc.user
  }), dispatch => bindActionCreators({

  }))(injectIntl(CategoriesHome));
