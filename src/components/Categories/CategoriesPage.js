import React, { Component } from 'react';
import ApiService from '../../services/ApiService';
import { List, Switch, Card } from 'antd';
import { Helmet } from 'react-helmet'
import { injectIntl } from 'react-intl';

import { ErrorPlaceholder } from '../Common';
import EditCategory from './EditCategory';
import CategoryCard from './CategoryCard';

const cardStyle = {
  marginBottom: "12px"
}

class CategoriesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isError: false,
      isLoading: true,
      showCard: false,
      categories: { items: [] },
      selectedCategory: null
    };
  }

  async componentDidMount() {
    this.setState({
      showCard: JSON.parse(localStorage.getItem('categories.cardview'))
    })
    await this.loadCategories();
  }

  reloadCategories = async () => {
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

  renderLoadingError() {
    const { intl } = this.props;
    const message = intl.formatMessage({ id: 'categories.messages.error.loading' });
    const buttonText = intl.formatMessage({ id: 'action.retry' });
    return (<ErrorPlaceholder fullWidth={true} message={message}
      showButton={true} buttonText={buttonText}
      buttonAction={this.loadCategories.bind(this)} />)
  }

  renderAdd(createLink) {
    if (createLink) {
      return <EditCategory button createLink={createLink} isAdding={true} onUpdated={this.reloadCategories} />
    }

    return null;
  }


  onToggleCardView(checked) {
    localStorage.setItem('categories.cardview', checked);
    this.setState({ showCard: checked })
  }

  render() {
    const { categories, isLoading, showCard, isError } = this.state;
    const createLink = (categories && categories.links) ? categories.links.create : null;

    if (isError) {
      return this.renderLoadingError();
    }

    const extras = (<>
      {this.renderAdd(createLink)}
      <span className="ml-2" />
      <Switch checkedChildren={this.props.intl.formatMessage({ id: "action.card" })}
        unCheckedChildren={this.props.intl.formatMessage({ id: "action.list" })}
        onChange={this.onToggleCardView.bind(this)} checked={this.state.showCard} />
    </>)

    return (
      <>
        <Helmet title={this.props.intl.formatMessage({ id: "header.categories" })} />
        <Card title={this.props.intl.formatMessage({ id: "header.categories" })} type="inner" extra={extras} style={cardStyle}>
          <List
            size="large"
            grid={showCard ? { gutter: 8, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 6 } : null}
            loading={isLoading}
            locale={{
              emptyText: this.props.intl.formatMessage({ id: 'categories.messages.empty' })
            }}
            dataSource={categories.items}
            renderItem={c => (<CategoryCard key={c.id} card={showCard} category={c} onUpdated={this.loadCategories.bind(this)} />)}
          />
        </Card>
      </>
    );
  }
}

export default injectIntl(CategoriesPage);

