import React, { Component } from 'react';
import ApiService from '../../services/ApiService';
import { injectIntl } from 'react-intl';
import { ErrorPlaceholder } from '../Common';
import { List, Switch, Card } from 'antd';

import EditSeries from './EditSeries';
import SeriesCard from './SeriesCard';
import { Helmet } from 'react-helmet'

const cardStyle = {
  marginBottom: "12px"
}

class SeriesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isError: false,
      isLoading: true,
      showCard: false,
      series: { data: [] }
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
        <Helmet title={this.props.intl.formatMessage({ id: "header.series" })} />
        <Card title={this.props.intl.formatMessage({ id: "header.series" })} type="inner" extra={extras} style={cardStyle}>
          <List
            size="large"
            grid={showCard ? { gutter: 8, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 6 } : null}
            loading={isLoading}
            locale={{
              emptyText: this.props.intl.formatMessage({ id: 'series.messages.empty' })
            }}
            dataSource={series.data}
            renderItem={s => (<SeriesCard key={s.id} card={showCard} series={s} onUpdated={this.loadSeries.bind(this)} />)}
          />
        </Card>
      </>
    );
  }
}

export default injectIntl(SeriesPage);
