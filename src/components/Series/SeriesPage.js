import React, { Component } from 'react';
import ApiService from '../../services/ApiService';
import { injectIntl, FormattedMessage } from 'react-intl';
import { ErrorPlaceholder, EmptyPlaceholder, Loading } from '../Common';
import { List, Switch } from 'antd';

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
    await this.loadSeries();
  }

  reloadSeries = async()  => {
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
        <EmptyPlaceholder fullWidth={true} message={message} iconName='chain' showButton={false} >
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
    this.setState({showCard: checked})
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
      return (
        <>
          <Helmet title={this.props.intl.formatMessage({ id: "header.series" })} />
          <main id="main-container">
            <div className="block">
              <div className="block-header">
                <FormattedMessage id="header.series" />
                <div className="block-options">
                  {this.renderAdd(createLink)}
                  <span className="ml-2"/>
                  <Switch checkedChildren={this.props.intl.formatMessage({ id: "action.list" })}
                          unCheckedChildren={this.props.intl.formatMessage({ id: "action.card" })}
                          onChange={this.onToggleCardView.bind(this)} />
                </div>
              </div>
              <div className="block-content">
                <List
                  size="large"
                  grid={ showCard ? { gutter: 8, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 6 } : null}
                  bordered
                  dataSource={series.items}
                  renderItem={s => (<SeriesCard key={s.id} card={showCard} series={s} onUpdated={this.loadSeries.bind(this)} />)}
                />
              </div>
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
