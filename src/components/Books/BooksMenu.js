import React from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';

class BooksMenu extends React.Component {
    renderCategories(categories) {
        if (categories && categories.items) {
            var menuItems = [];

            menuItems.push(<li key="books"> <Link to={`/books`} > <FormattedMessage id="header.books.list" /></Link></li>);
            menuItems.push(categories.items.map(c => (<li key={c.id}><Link to={`/books?category=${c.id}`}> {c.name}</Link></li>)));

            return menuItems;
        }

        return null;
    }

    render() {
        const { categories } = this.props;

        const categoriesItem = this.renderCategories(categories);
        return (
            <li className="menu-item-has-children">
                <a href="javascript:void(0);"><FormattedMessage id="header.books" /></a>
                <ul className="sub-menu">
                    {categoriesItem}
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
