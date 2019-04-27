import React, { Component } from 'react';
import ApiService from '../../services/ApiService';
import { injectIntl, FormattedMessage } from 'react-intl';
import { ErrorPlaceholder, EmptyPlaceholder, Loading } from '../Common';
import { List, Switch, Card } from 'antd';

import EditSeries from './EditSeries';
import SeriesCard from './SeriesCard';
import { Helmet } from 'react-helmet'

class SeriesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isError: false,
      isLoading: true,
      showCard: false,
      series: { items: [] }
    };
  }

  async componentDidMount() {
    this.setState({
      showCard: JSON.parse(localStorage.getItem('series.cardview'))
    })
    await this.loadSeries();
  }

  reloadSeries = async () => {
    await this.loadSeries();
  }

  async loadSeries() {
    this.setState({
      isLoading: true
    });

    try {
      let result = await ApiService.getSeries();
      this.setState({
        isLoading: false,
        isError: false,
        series: result
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
    const message = intl.formatMessage({ id: 'series.messages.error.loading' });
    const buttonText = intl.formatMessage({ id: 'action.retry' });
    return (<ErrorPlaceholder fullWidth={true} message={message}
      showButton={true} buttonText={buttonText}
      buttonAction={this.loadSeries.bind(this)} />)
  }

  renderEmptyPlaceHolder(createLink) {
    const { intl } = this.props;
    const message = intl.formatMessage({ id: 'series.messages.empty' });

    return (
      <EmptyPlaceholder fullWidth={true} description={message} iconName='chain' showButton={false} >
        {this.renderAdd(createLink)}
      </EmptyPlaceholder>
    );
  }

  renderAdd(createLink) {
    if (createLink) {
      return <EditSeries button createLink={createLink} isAdding={true} onUpdated={this.reloadSeries} />
    }

    return null;
  }

  onToggleCardView(checked) {
    localStorage.setItem('series.cardview', checked);
    this.setState({ showCard: checked })
  }

  render() {
    const { series, isLoading, isError, showCard } = this.state;
    const createLink = (series && series.links) ? series.links.create : null;

    if (isLoading) {
      return <Loading fullWidth={true} />;
    } else if (isError) {
      return this.renderLoadingError();
    }

    if (series && series.items && series.items.length > 0) {
      const extras = (<>
        {this.renderAdd(createLink)}
        <span className="ml-2" />
        <Switch checkedChildren={this.props.intl.formatMessage({ id: "action.card" })}
          unCheckedChildren={this.props.intl.formatMessage({ id: "action.list" })}
          onChange={this.onToggleCardView.bind(this)} checked={this.state.showCard} />
      </>)
      return (
        <>
          <Helmet title={this.props.intl.formatMessage({ id: "header.series" })} />
          <main id="main-container">
            <div className="content content-boxed">
              <Card title={this.props.intl.formatMessage({ id: "header.categories" })} type="inner" extra={extras} >
                <List
                  size="large"
                  grid={showCard ? { gutter: 8, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 6 } : null}
                  dataSource={series.items}
                  renderItem={s => (<SeriesCard key={s.id} card={showCard} series={s} onUpdated={this.loadSeries.bind(this)} />)}
                />
              </Card>
            </div>
          </main>
        </>
      );
    }
    else
      return this.renderEmptyPlaceHolder(createLink);
  }
}

export default injectIntl(SeriesPage);
