import React, { Component } from 'react'
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { List, Card } from 'antd';

import DeleteSeries from './DeleteSeries';
import EditSeries from './EditSeries';

const { Meta } = Card;

class SeriesCard extends Component {
    constructor(props) {
        super(props);
    }

    renderSeriesActions(series) {
        let actions = [];
        
        if (!series || !series.links) return null;
        const editLink = series.links.update;
        const deleteLink = series.links.delete;

        if (editLink) {
            actions.push(<EditSeries series={series} onUpdated={this.props.onUpdated}/>)
        }

        if (deleteLink) {
            actions.push(<DeleteSeries series={series} onDeleted={this.props.onUpdated}/>);
        }

        if (actions.length > 0) {
            return actions;
        }

        return null;
    }

    render() {
        const { series, card } = this.props;
        if (series == null) {
            return
        }

        const title = <Link to={`/books?series=${series.id}`}>{series.name}</Link>;
        const actions = this.renderSeriesActions(series);
        const bookCount = <FormattedMessage id="series.item.book.count" values={{ count: series.bookCount }} />;
        
        if (card) {
            return (
                <List.Item key={series.id} >
                    <Card
                        hoverable
                        actions={actions}
                        cover={<img className="p-4" width="64px" src="/resources/img/series.png" />}
                    >
                        <Meta
                            title={title}
                            description={bookCount} />
                    </Card>
                </List.Item>
            )
        }
        else {
            return (
                <List.Item key={series.id} actions={actions}>
                    <List.Item.Meta
                        avatar={<img width="48" height="48" src="/resources/img/series.png" />}
                        title={title}
                        description={series.description}>
                    </List.Item.Meta>
                    <div>{bookCount}</div>
                </List.Item>
            );

        }
    }
}


export default injectIntl(SeriesCard);

SeriesCard.propTypes = {
    onUpdated: PropTypes.func,
    series: PropTypes.object.isRequired,
    card: PropTypes.bool
};
