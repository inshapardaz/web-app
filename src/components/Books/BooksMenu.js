import React from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';

class BooksMenu extends React.Component {
    renderCategory(c) {
        return (
            <Link key="booksMenu" 
                  className="dropdown-item" 
                  to={`/books?category=${c.id}`}>
                  <i className="fa fa-book mr-2" />
                  {c.name}
            </Link>);
    }
    renderCategories(categories) {
        if (categories && categories.items) {
            var menuItems = [];
            menuItems.push(<Link key="booksMenu" className="dropdown-item" to={`/books`}>
                <i className="fa fa-book mr-2" />
                <FormattedMessage id="header.books.list" />
            </Link>);
            menuItems.push(<div className="dropdown-divider"></div>);
            menuItems.push(categories.items.map(c => this.renderCategory(c)));

            return menuItems;
        }

        return null;
    }

    render() {
        const { categories } = this.props;

        const categoriesItem = this.renderCategories(categories);

        return (
            <div className="dropdown">
                <button type="button" className="btn btn-sm btn-dual mr-2 dropdown-toggle" id="dropdown-default-primary" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i className="fa fa-book mr-2" />
                </button>
                <div className="dropdown-menu font-size-sm" aria-labelledby="dropdown-default-primary">
                    {categoriesItem}
                </div>
            </div>
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
