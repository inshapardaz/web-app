import React, { Component } from 'react';
import ApiService from '../../services/ApiService';
import { Card, Icon, Button, Segment, Header, Confirm } from 'semantic-ui-react';
import { injectIntl, FormattedMessage } from 'react-intl';

import { success, error } from '../../services/toasts';

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
      showEdit: false,
      confirmDelete: false
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

  onDeleteClicked(Series) {
    this.setState({
      selectedSeries: Series,
      confirmDelete: true
    });
  }

  async deleteSeries() {
    const { selectedSeries } = this.state;
    if (!selectedSeries) return;

    let deleteLink = selectedSeries.links.delete;
    if (!deleteLink) return;

    this.setState({
      confirmDelete: false
    });

    try {
      await ApiService.delete(deleteLink);
      success(this.props.intl.formatMessage({ id: "series.messages.deleted" }));
      await this.reloadSeries();

      this.setState({
        selectedSeries: null
      });
    }
    catch{
      error(this.props.intl.formatMessage({ id: "series.messages.error.delete" }));
    }
  }
  
  renderSeries(series) {
    return series.items.map(s =>
      <SeriesCard key={s.id} series={s} 
        onEdit={this.onEditClicked.bind(this, s)}
        onDelete={this.onDeleteClicked.bind(this, s)} />)
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

  renderDelete() {
    const { confirmDelete, selectedSeries } = this.state;
    if (confirmDelete && selectedSeries) {
      const { intl } = this.props;

      return (<Confirm size="mini" open={confirmDelete}
        content={intl.formatMessage({ id: 'series.action.confirmDelete' }, { name: selectedSeries.name })}
        cancelButton={intl.formatMessage({ id: 'action.no' })}
        confirmButton={intl.formatMessage({ id: 'action.yes' })}
        onCancel={() => this.setState({ confirmDelete: false })}
        onConfirm={this.deleteSeries.bind(this)} closeIcon />);
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
      addButton = (<Button onClick={this.addSeries.bind(this)} attached='top'><Icon name='add' />
                    <FormattedMessage id="series.action.create" />
                  </Button>);
    }

    if (series && series.items && series.items.length > 0) {
      return (
        <>
          <Header as='h2' icon='chain' content={<FormattedMessage id="header.series" />} />
          {addButton}
          <Segment padded={true} attached>
            <Card.Group stackable centered>{this.renderSeries(series)}</Card.Group>              
          </Segment>
          {this.renderDelete()}
          {this.renderEditor(createLink)}
        </>
      );
    }
    else
      return this.renderEmptyPlaceHolder(createLink);
  }
}

export default injectIntl(SeriesHome);
