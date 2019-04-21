import React, { Component } from 'react';
import ApiService from '../../services/ApiService';
import { Link } from 'react-router-dom';
import { Card, Icon, Button, Segment, Header, Confirm } from 'semantic-ui-react';
import { injectIntl, FormattedMessage } from 'react-intl';

import { success, error } from '../../services/toasts';

import { ErrorPlaceholder, EmptyPlaceholder, Loading } from '../Common';
import EditCategory from './EditCategory';
import CategoryCard from './CategoryCard';

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

    try {
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

    let deleteLink = selectedCategory.links.delete;
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

  renderCategories(categories) {
    return categories.items.map(c =>
      <CategoryCard key={c.id} category={c}
        onEdit={this.onEditClicked.bind(this, c)}
        onDelete={this.onDeleteClicked.bind(this, c)} />)
  }

  renderLoadingError() {
    const { intl } = this.props;
    const message = intl.formatMessage({ id: 'categories.messages.error.loading' });
    const buttonText = intl.formatMessage({ id: 'action.retry' });
    return (<ErrorPlaceholder fullWidth={true} message={message}
      showButton={true} buttonText={buttonText}
      buttonAction={this.loadCategories.bind(this)} />)
  }

  renderEmptyPlaceHolder(createLink) {
    const { intl } = this.props;
    const message = intl.formatMessage({ id: 'categories.messages.empty' });
    const buttonText = intl.formatMessage({ id: 'categories.action.create' });

    return (
      <>
        {createLink ? this.renderEditor(createLink) : null}
        <EmptyPlaceholder fullWidth={true} message={message} iconName='folder outline'
          showButton={true} buttonText={buttonText}
          buttonAction={this.addCategory.bind(this)} />
      </>
    );
  }
  renderEditor(createLink) {
    const { isAdding, showEdit, selectedCategory } = this.state;
    if (showEdit && selectedCategory) {
      return (<EditCategory open={showEdit} category={selectedCategory}
        createLink={createLink} isAdding={isAdding}
        onOk={this.reloadCategories.bind(this)}
        onClose={this.onCloseEdit.bind(this)} />);
    }

    return null;
  }

  renderDelete() {
    const { confirmDelete, selectedCategory } = this.state;
    if (confirmDelete && selectedCategory) {
      const { intl } = this.props;

      return (<Confirm size="mini" open={confirmDelete}
        content={intl.formatMessage({ id: 'categories.action.confirmDelete' }, { name: selectedCategory.name })}
        cancelButton={intl.formatMessage({ id: 'action.no' })}
        confirmButton={intl.formatMessage({ id: 'action.yes' })}
        onCancel={() => this.setState({ confirmDelete: false })}
        onConfirm={this.deleteCategory.bind(this)} closeIcon />);
    }

    return null;
  }

  render() {
    const { categories, isLoading, isAdding, isError, showEdit, selectedCategory } = this.state;
    const createLink = (categories && categories.links) ? categories.links.create : null;

    if (isLoading) {
      return <Loading fullWidth={true} />;
    } else if (isError) {
      return this.renderLoadingError();
    }

    if (categories && categories.items && categories.items.length > 0) {
      return (
        <>
          <main id="main-container">
            <CategoriesHeader createLink={createLink} onCreate={this.addCategory.bind(this)} />
            <div className="block">
              <div className="block-content">
                <table className="table table-hover table-vcenter font-size-sm">
                  <tbody>
                    {this.renderCategories(categories)}
                  </tbody>
                </table>
              </div>
            </div>
            {this.renderDelete()}
            {this.renderEditor(createLink)}
          </main>
        </>
      );
    }
    else
      return this.renderEmptyPlaceHolder(createLink);
  }
}

export default injectIntl(CategoriesHome);

class CategoriesHeader extends React.Component {
  render() {
    return (
      <div className="bg-image overflow-hidden" style={{ backgroundImage: "url('assets/media/photos/photo3@2x.jpg')" }}>
        <div className="bg-primary-dark-op">
          <div className="content content-narrow content-full">
            <div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center mt-5 mb-2 text-center text-sm-left">
              <div className="flex-sm-fill">
                <h1 className="font-w600 text-white mb-0" data-toggle="appear"><FormattedMessage id="header.categories" /></h1>
              </div>
              {this.props.createLink ?
                (<div className="flex-sm-00-auto mt-3 mt-sm-0 ml-sm-3">
                  <span className="d-inline-block" data-toggle="appear" data-timeout="350">
                    <a className="btn btn-primary px-4 py-2" data-toggle="click-ripple" href="javascript:void(0)" onClick={this.props.onCreate}>
                      <i className="fa fa-plus mr-1" /> <FormattedMessage id="categories.action.create" />
                    </a>
                  </span>
                </div>) : null}
            </div>
          </div>
        </div>
      </div>);
  }
}
