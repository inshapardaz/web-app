import React from 'react'
import { Link } from 'react-router-dom';
import { Dropdown, Menu, Icon } from 'semantic-ui-react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';

class BooksMenu extends React.Component {
    renderCategories(categories) {
        if (categories && categories.items) {
            var menuItems = [];

            menuItems.push(<Menu.Item key="0" as={Link} to={`/books`} >
                <Icon name='book' /><FormattedMessage id="header.books.list" /></Menu.Item>);
            menuItems.push(<Dropdown.Divider key="divider-1" />);
            menuItems.push(categories.items.map(c => (
                <Dropdown.Item key={c.id} as={Link} to={`/books?category=${c.id}`}>
                    {c.name}
                </Dropdown.Item>)));

            return menuItems;
        }

        return null;
    }

    render() {
        const { categories, isMobile } = this.props;

        const categoriesItem = this.renderCategories(categories);

        if (isMobile) {
            return (
                <React.Fragment>
                    <Dropdown.Menu>
                        <a className="item">
                            <Icon name="book"></Icon>
                            <FormattedMessage id="header.books" />
                        </a>
                        {categoriesItem}
                    </Dropdown.Menu>
                </React.Fragment>
            );
        }
        else {

            return (
                <Dropdown item simple trigger={<><Icon name="book" inverted /> <FormattedMessage id="header.books" /></>}>
                    <Dropdown.Menu>
                        {categoriesItem}
                    </Dropdown.Menu>
                </Dropdown>
            );
        }
    }
}

export default (connect(
    (state) => ({
        categories: state.apiReducers.categories
    }),
    dispatch => bindActionCreators({
    }, dispatch)
)(BooksMenu));
