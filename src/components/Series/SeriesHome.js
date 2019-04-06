import React, { Component } from 'react';
import ApiService from '../../services/ApiService';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { ErrorPlaceholder, EmptyPlaceholder, Loading } from '../Common';
import EditSeries from './EditSeries';
import SeriesCard from './SeriesCard';

class SeriesHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isError: false,
      isLoading: true,
      series: { items: [] },
      showEditor: false,
      selectedSeries: null,
      isAdding: false,
      showEdit: false
    };
  }

  async componentDidMount() {
    await this.loadSeries();
  }

  async reloadSeries() {
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

  addSeries() {
    this.setState({
      selectedSeries: {},
      showEdit: true,
      isAdding: true,
    });
  }

  onEditClicked(series) {
    this.setState({
      selectedSeries: series,
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
  
  renderSeries(series) {
    return series.items.map(s =>
      <SeriesCard key={s.id} series={s} 
        onEdit={this.onEditClicked.bind(this, s)}
        OnDeleted={this.loadSeries.bind(this)} />)
  }

  renderLoadingError() {
    const { intl } = this.props;
    const message = intl.formatMessage({ id: 'series.messages.error.loading' });
    const buttonText = intl.formatMessage({ id: 'action.retry' });
    return (<ErrorPlaceholder message={message}
      showButton={true} buttonText={buttonText}
      buttonAction={this.loadSeries.bind(this)} />)
  }

  renderEmptyPlaceHolder(createLink) {
    const { intl } = this.props;
    const message = intl.formatMessage({ id: 'series.messages.empty' });
    const buttonText = intl.formatMessage({ id: 'series.action.create' });

    return (
      <>
        {createLink ? this.renderEditor(createLink) : null}
        <EmptyPlaceholder message={message} iconName='chain'
          showButton={true} buttonText={buttonText}
          buttonAction={this.addSeries.bind(this)} />
      </>
    );
  }
  renderEditor(createLink) {
    const { isAdding, showEdit, selectedSeries } = this.state;
    if (showEdit && selectedSeries) {
      return (<EditSeries open={showEdit} series={selectedSeries}
        createLink={createLink} isAdding={isAdding}
        onOk={this.reloadSeries.bind(this)}
        onClose={this.onCloseEdit.bind(this)} />);
    }

    return null;
  }

  render() {
    const { series, isLoading, isError } = this.state;
    const createLink = (series && series.links) ? series.links.create : null;

    if (isLoading) {
      return <Loading />;
    } else if (isError) {
      return this.renderLoadingError();
    }

    let addButton = null;
    if (createLink) {
      addButton = <a className="tg-btn" onClick={this.addSeries.bind(this)} href="javascript:void(0);"><FormattedMessage id="series.action.create" /></a>
    }

    if (series && series.items && series.items.length > 0) {
      return (
        <>
          <SeriesHeader />
          <main id="tg-main" className="tg-main tg-haslayout">
            <div className="tg-authorsgrid">
              <div className="container">
                <div className="row">
                  <div className="tg-authors">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <div className="tg-sectionhead">
                        <h2>{this.props.intl.formatMessage({id:'header.series'})}</h2>
                        {addButton}
                      </div>
                    </div>

                    {this.renderSeries(series)}
                  </div>
                </div>
              </div>
            </div>
          {this.renderEditor(createLink)}
          </main>
        </>
      );
    }
    else
      return this.renderEmptyPlaceHolder(createLink);
  }
}

export default injectIntl(SeriesHome);

class SeriesHeader extends React.Component {
  render() {
    return (
      <div className="tg-innerbanner tg-haslayout tg-parallax tg-bginnerbanner" data-z-index="-100" data-appear-top-offset="600" style={{ backgroundImage: `url('images/parallax/bgparallax-05.jpg')`}}>
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div className="tg-innerbannercontent">
                  <h1><FormattedMessage id="header.series" /></h1>
                  <ol className="tg-breadcrumb">
                    <li><Link to="/"><FormattedMessage id="header.home" /></Link></li>
                    <li className="tg-active"><FormattedMessage id="header.series" /></li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
      </div>);
  }
}
