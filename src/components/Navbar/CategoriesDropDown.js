import React from 'react'
import { Link } from 'react-router-dom';
import { Dropdown, Menu, Icon } from 'semantic-ui-react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';

class CategoriesDropDown extends React.Component {
    renderCategories(categories) {
        if (categories && categories.items) {
            var menuItems = [];

            menuItems.push(<Menu.Item key="0" as={Link} to={`/categories`} >
                <Icon name='folder outline' /><FormattedMessage id="header.categories.list" /></Menu.Item>);
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
                            <Icon name="folder outline"></Icon>
                            <FormattedMessage id="header.categories" />
                        </a>
                        {categoriesItem}
                    </Dropdown.Menu>
                </React.Fragment>
            );
        }
        else {

            return (
                <Dropdown item simple trigger={<><Icon name="folder outline" inverted /> <FormattedMessage id="header.categories" /></>}>
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
)(CategoriesDropDown));
