import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '../../services/ApiService';
import { List, Icon, Button, Segment, Header, Confirm } from 'semantic-ui-react';
import { injectIntl, FormattedMessage } from 'react-intl';

import rel from '../../services/rel';
import { success, error } from '../../services/toasts';

import { ErrorPlaceholder, EmptyPlaceholder, Loading } from '../Common';
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
      isAdding: false,
      showEdit: false,
      confirmDelete: false
    };
  }

  async componentDidMount() {
    await this.loadCategories();
  }

  async reloadCategories() {
    await this.loadCategories();
  }

  async loadCategories() {
    this.setState({
      isLoading: true
    });

    try{
      let result = await ApiService.getCategories();
      this.setState({
        isLoading: false,
        isError: false,
        categories: result
      });
    }
    catch{
      this.setState({
        isLoading: false,
        isError: true
      });
    }
  }

  addCategory() {
    this.setState({
      selectedCategory: {},
      showEdit: true,
      isAdding: true,
    });
  }

  onEditClicked(category) {
    this.setState({
      selectedCategory: category,
      showEdit: true,
      isAdding: false
    });
  }

  onCloseEdit() {
    this.setState({
      showEdit: false,
      isAdding: false
    });
  }

  onDeleteClicked(category) {
    this.setState({
      selectedCategory: category,
      confirmDelete: true
    });
  }

  async deleteCategory() {
    const { selectedCategory } = this.state;
    if (!selectedCategory) return;

    let deleteLink = rel(selectedCategory.links, 'delete');
    if (!deleteLink) return;

    this.setState({
      confirmDelete: false
    });

    try {
      await ApiService.delete(deleteLink);
      success(this.props.intl.formatMessage({ id: "categories.messages.deleted" }));
      await this.reloadCategories();

      this.setState({
        selectedCategory: null
      });
    }
    catch{
      error(this.props.intl.formatMessage({ id: "categories.messages.error.delete" }));
    }
  }

  renderCategoryActions(category) {
    let actions = [];
    const editLink = rel(category.links, 'update');
    const deleteLink = rel(category.links, 'delete');

    if (editLink) {
      actions.push(<Button key="edit" icon="pencil" onClick={this.onEditClicked.bind(this, category)} />)
    }
    if (deleteLink) {
      actions.push(<Button key="delete" icon="delete" onClick={this.onDeleteClicked.bind(this, category)} />)
    }

    return (<Button.Group icon>{actions}</Button.Group>);
  }

  renderCategories(categories) {
    return categories.items.map(c =>
      <List.Item key={c.id}>
        <List.Content floated='right'>
          {this.renderCategoryActions(c)}
        </List.Content>
        <Icon name="folder outline" />
        <List.Content as={Link} to={`/books?category=${c.id}`}>{c.name}</List.Content>
      </List.Item>)
  }

  renderLoadingError() {
    const {intl} = this.props;
    const message = intl.formatMessage({ id: 'categories.messages.error.loading' });
    const buttonText = intl.formatMessage({ id: 'action.retry' });
    return (<ErrorPlaceholder message={message}
      showButton={true} buttonText={buttonText}
      buttonAction={this.loadCategories.bind(this)} />)
  }

  renderEmptyPlaceHolder() {
    const {intl} = this.props;
    const message = intl.formatMessage({ id: 'categories.messages.empty' });
    const buttonText = intl.formatMessage({ id: 'categories.action.create' });

    return (
      <EmptyPlaceholder message={message} iconName='folder outline'
        showButton={true} buttonText={buttonText}
        buttonAction={this.addCategory.bind(this)} />
    );
  }

  render() {
    const { categories, isLoading, isAdding, isError, showEdit, confirmDelete, selectedCategory } = this.state;
    const createLink = (categories && categories.links) ? rel(categories.links, 'create') : null;
    const selectedCategoryName = selectedCategory ? selectedCategory.name : '';

    if (isLoading) {
      return <Loading />;
    } else if (isError) {
      return this.renderLoadingError();
    }

    let addButton = null;
    if (createLink) {
      addButton = <Button onClick={this.addCategory.bind(this)} attached='top'><Icon name='add' /><FormattedMessage id="categories.action.create" /></Button>
    }

    let editModal = null;
    if (showEdit){
      editModal = (<EditCategory open={showEdit} category={selectedCategory} 
        createLink={createLink} isAdding={isAdding}
      onOk={this.reloadCategories.bind(this)}
      onClose={this.onCloseEdit.bind(this)} />);
    }
    let deleteConfirm = null;
    if (confirmDelete){
      deleteConfirm = (<Confirm size="mini" open={confirmDelete}
      content={this.props.intl.formatMessage({ id: 'categories.action.confirmDelete' }, { name: selectedCategoryName })}
      cancelButton={this.props.intl.formatMessage({ id: 'action.no' })}
      confirmButton={this.props.intl.formatMessage({ id: 'action.yes' })}
      onCancel={() => this.setState({ confirmDelete: false })}
      onConfirm={this.deleteCategory.bind(this)} />);
    }

    if (categories && categories.items && categories.items.length > 0) {
      return (
        <>
          <Header as='h2' icon='folder outline' content={<FormattedMessage id="header.categories" />} />
          {addButton}
          <Segment padded={true} attached>
            <List divided verticalAlign='middle' relaxed='very'>
              {this.renderCategories(categories)}
            </List>
          </Segment>
          {addButton}
          {deleteConfirm}
          {editModal}
        </>
      );
    }
    else
      return this.renderEmptyPlaceHolder();
  }
}

export default injectIntl(CategoriesHome);
