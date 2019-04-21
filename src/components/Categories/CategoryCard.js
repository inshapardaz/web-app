import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

export default class CategoryCard extends Component {
    renderCategoryActions(category) {
        let actions = [];
        const editLink = category.links.update;
        const deleteLink = category.links.delete;

        if (editLink) {
            actions.push(<button key="edit" className="tg-facebook" onClick={this.props.onEdit} className="btn btn-sm btn-light"><i className="fa fa-edit" /></button>)
        }
        if (deleteLink) {
            actions.push(<button key="delete" className="tg-linkedin" onClick={this.props.onDelete} className="btn btn-sm btn-light"><i className="fa fa-trash" /></button>);
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
        const { category } = this.props;
        if (category == null) {
            return
        }

        return (
            <tr>
                <td>
                    <Link className="font-w600" to={`/books?category=${category.id}`}>{category.name}</Link>
                    <div className="text-muted mt-1"><FormattedMessage id="categories.item.book.count" values={{ count: category.bookCount }} /></div>
                </td>
                {this.renderCategoryActions(category)}
            </tr>
        );
    }
}
