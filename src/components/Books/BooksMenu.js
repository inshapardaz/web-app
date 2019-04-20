import React from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';

class BooksMenu extends React.Component {
    renderCategory(c) {
        return (
            <li key={c.id} className="nav-main-item">
                <Link className="nav-main-link"
                    to={`/books?category=${c.id}`}>
                    <i className="fa fa-book mr-2" />
                    <span className="nav-main-link-name">{c.name}</span>
                </Link>
            </li>);
    }
    renderCategories(categories) {
        if (categories && categories.items) {
            var menuItems = [];
            menuItems.push(
                <li key="booksMenu" className="nav-main-item">
                    <Link className="nav-main-link" to={`/books`}>
                        <i className="fa fa-book mr-2" />
                        <span className="nav-main-link-name"><FormattedMessage id="header.books.list" /></span>
                    </Link>
                </li>);
            menuItems.push(<div key="booksMenu-sep" className="dropdown-divider"></div>);
            menuItems.push(categories.items.map(c => this.renderCategory(c)));

            return menuItems;
        }

        return null;
    }

    render() {
        const { categories } = this.props;

        return (
            <li key="books" className="nav-main-item">
                <a className="nav-main-link nav-main-link-submenu" data-toggle="submenu" aria-haspopup="true" aria-expanded="false" href="#">
                    <i className="nav-main-link-icon si si-book-open"></i>
                    <span className="nav-main-link-name"><FormattedMessage id="header.books" /></span>
                </a>
                <ul className="nav-main-submenu">
                    {this.renderCategories(categories)}
                </ul>
            </li>
        );
    }
}

export default (connect(
    (state) => ({
        categories: state.apiReducers.categories
    }),
    dispatch => bindActionCreators({
    }, dispatch)
)(BooksMenu));
