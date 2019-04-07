import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

export default class CategoryCard extends Component {
    renderCategoryActions(category) {
        let actions = [];
        const editLink = category.links.update;
        const deleteLink = category.links.delete;

        if (editLink) {
            actions.push(<li key="edit" className="tg-facebook" onClick={this.props.onEdit}><i className="fa fa-edit"></i></li>)
        }
        if (deleteLink) {
            actions.push(<li key="delete" className="tg-linkedin" onClick={this.props.onDelete}><i className="fa fa-trash"></i></li>);
        }

        if (actions.length > 0) {
            return (<ul className="tg-socialicons">
                {actions}
            </ul>);
        }

        return null;
    }

    render() {
        const { category } = this.props;
        if (category == null) {
            return
        }

        return (
            <div className="col-xs-6 col-sm-4 col-md-3 col-lg-2">
                <div className="tg-author">
                    <figure>
                        <Link to={`/books?category=${category.id}`}>
                            <img src='/resources/img/series.svg' />
                        </Link>
                    </figure>
                    <div className="tg-authorcontent">
                        <h2><Link to={`/books?category=${category.id}`}>{category.name}</Link></h2>
                        <FormattedMessage id="categories.item.book.count" values={{ count: category.bookCount }} />
                        {this.renderCategoryActions(category)}
                    </div>
                </div>
            </div>
        );
    }
}
