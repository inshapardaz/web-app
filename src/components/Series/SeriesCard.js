import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { question, success, error } from '../../services/toasts'; 
import ApiService from '../../services/ApiService';
import { Icon } from 'semantic-ui-react';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';

class SeriesCard extends Component {
    constructor(props){
        super(props);
        this.onDeleteClicked = this.onDeleteClicked.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    onDeleteClicked() {
        const { series } = this.props;
        const action = this.props.intl.formatMessage({ id: 'action.delete' });
        const message = this.props.intl.formatMessage({ id: 'series.action.confirmDelete' }, { name: series.name });
        question(message, action, this.onDelete);
    }

    async onDelete() {
        const { series } = this.props;
        if (!series) return;
    
        let deleteLink = series.links.delete;
        if (!deleteLink) return;
    
        this.setState({
          confirmDelete: false
        });
    
        try {
          await ApiService.delete(deleteLink);
          success(this.props.intl.formatMessage({ id: "series.messages.deleted" }));
          await this.props.OnDeleted();
        }
        catch{
          error(this.props.intl.formatMessage({ id: "series.messages.error.delete" }));
        }
    }

    renderSeriesActions(series) {
        let actions = [];
        const editLink = series.links.update;
        const deleteLink = series.links.delete;

        if (editLink) {
            actions.push(<Card.Link key="edit" onClick={this.props.onEdit} >
                <Icon name="pencil" color="green" /> <FormattedMessage id="action.edit" />
            </Card.Link>)
        }

        if (deleteLink) {
            actions.push(<Card.Link key="delete" onClick={this.onDeleteClicked}>
                <Icon name="delete" color="red" /> <FormattedMessage id="action.delete" />
            </Card.Link>)
        }

        if (actions.length > 0) {
            return (<Card.Footer>
                {actions}
            </Card.Footer>);
        }

        return null;
    }

    render() {
        const { series } = this.props;
        if (series == null) {
            return
        }

        return (<Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src="/resources/img/series.svg" height="180" width="286" />
            <Card.Body>
                <Card.Title><Link to={`/books?series=${series.id}`}>{series.name}</Link></Card.Title>
                <Card.Subtitle className="mb-2 text-muted"><FormattedMessage id="series.item.book.count" values={{ count: series.bookCount }} /></Card.Subtitle>
                <Card.Text>
                    {series.description}
                </Card.Text>

            </Card.Body>
            {this.renderSeriesActions(series)}
        </Card>);
    }
}


export default injectIntl(SeriesCard);

SeriesCard.propTypes = {
    OnDeleted: PropTypes.func.isRequired,
    inverted: PropTypes.bool,
    icon: PropTypes.string,
    fluid: PropTypes.bool,
    content: PropTypes.object
};
