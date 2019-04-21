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
    return (<ErrorPlaceholder fullWidth={true} message={message}
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
        <EmptyPlaceholder fullWidth={true} message={message} iconName='chain'
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
      return <Loading fullWidth={true} />;
    } else if (isError) {
      return this.renderLoadingError();
    }

    if (series && series.items && series.items.length > 0) {
      return (
        <main id="main-container">
          <SeriesHeader createLink={createLink} onCreate={this.addSeries.bind(this)} />
          <div className="block">
            <div className="block-content">
              <table className="table table-hover table-vcenter font-size-sm">
                <tbody>
                  {this.renderSeries(series)}
                </tbody>
              </table>
              {this.renderEditor(createLink)}
            </div>
          </div>
        </main>
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
      <div className="bg-image overflow-hidden" style={{ backgroundImage: "url('assets/media/photos/photo3@2x.jpg')" }}>
        <div className="bg-primary-dark-op">
          <div className="content content-narrow content-full">
            <div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center mt-5 mb-2 text-center text-sm-left">
              <div className="flex-sm-fill">
                <h1 className="font-w600 text-white mb-0" data-toggle="appear"><FormattedMessage id="header.series" /></h1>
              </div>
              {this.props.createLink ?
                (<div className="flex-sm-00-auto mt-3 mt-sm-0 ml-sm-3">
                  <span className="d-inline-block" data-toggle="appear" data-timeout="350">
                    <a className="btn btn-primary px-4 py-2" data-toggle="click-ripple" href="javascript:void(0)" onClick={this.props.onCreate}>
                      <i className="fa fa-plus mr-1" /> <FormattedMessage id="series.action.create" />
                    </a>
                  </span>
                </div>) : null}
            </div>
          </div>
        </div>
      </div>);
  }
}
