import React from 'react'
import { Link } from 'react-router-dom';
import { Dropdown, Menu, Icon } from 'semantic-ui-react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';
import { NavDropdown } from 'react-bootstrap';

class BooksMenu extends React.Component {
    renderCategories(categories) {
        if (categories && categories.items) {
            var menuItems = [];

            menuItems.push(<NavDropdown.Item key="books" as={Link} to={`/books`} >
                <Icon name='book' /><FormattedMessage id="header.books.list" /></NavDropdown.Item >);
            menuItems.push(<NavDropdown.Divider key="book-div-1"/>);
            menuItems.push(categories.items.map(c => (
                <NavDropdown.Item key={c.id} as={Link} to={`/books?category=${c.id}`}>
                    {c.name}
                </NavDropdown.Item>)));

            return menuItems;
        }

        return null;
    }

    render() {
        const { categories, isMobile } = this.props;

        const categoriesItem = this.renderCategories(categories);
        return (
            <NavDropdown  title={ (<><Icon name='book' /> <FormattedMessage id="header.books" /></>)} id="basic-nav-dropdown">
                {categoriesItem}
            </NavDropdown>
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
