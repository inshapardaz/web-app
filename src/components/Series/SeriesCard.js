import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { question, success, error } from '../../services/toasts';
import ApiService from '../../services/ApiService';
import PropTypes from 'prop-types';

class SeriesCard extends Component {
    constructor(props) {
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
            actions.push(<button key="edit" type="button" onClick={this.props.onEdit} className="btn btn-sm btn-light"><i className="fa fa-edit"></i></button>)
        }

        if (deleteLink) {
            actions.push(<button key="delete" type="button" onClick={this.onDeleteClicked} className="btn btn-sm btn-light"><i className="fa fa-trash"></i></button>);
        }

        if (actions.length > 0) {
            return (<td className="text-center">
                <div className="btn-group">
                    {actions}
                </div>
            </td>);
        }

        return null;
    }

    render() {
        const { series } = this.props;
        if (series == null) {
            return
        }

        return (
            <tr>
                <td>
                    <Link className="font-w600" to={`/books?series=${series.id}`}>{series.name}</Link>
                    <div className="text-muted mt-1"><FormattedMessage id="series.item.book.count" values={{ count: series.bookCount }} /></div>
                </td>
                {this.renderSeriesActions(series)}
            </tr>
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
