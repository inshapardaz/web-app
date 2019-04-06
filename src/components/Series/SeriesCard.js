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
            actions.push(<li key="edit" className="tg-facebook" onClick={this.props.onEdit}><i className="fa fa-edit"></i></li>)
        }

        if (deleteLink) {
            actions.push(<li key="delete" className="tg-linkedin" onClick={this.onDeleteClicked}><i className="fa fa-trash"></i></li>);
        }

        if (actions.length > 0) {
            return (<ul className="tg-socialicons">
                {actions}
            </ul>);
        }

        return null;
    }

    render() {
        const { series } = this.props;
        if (series == null) {
            return
        }

        return (
            <div className="col-xs-6 col-sm-4 col-md-3 col-lg-2">
                <div className="tg-author">
                    <figure>
                        <Link to={`/books?series=${series.id}`}>
                            <img src='/resources/img/series.svg' />
                        </Link>
                    </figure>
                    <div className="tg-authorcontent">
                        <h2><Link to={`/books?series=${series.id}`}>{series.name}</Link></h2>
                        <FormattedMessage id="series.item.book.count" values={{ count: series.bookCount }} />
                        {this.renderSeriesActions(series)}
                    </div>
                </div>
            </div>
        );
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
