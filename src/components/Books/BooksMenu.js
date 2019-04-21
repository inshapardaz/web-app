import React from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';
import { closeSidebarCompact } from  '../../actions/uiActions';

class BooksMenu extends React.Component {
    state = {
        submenuOpen : false
    }
    renderCategory(c) {
        return (
            <li key={c.id} className="nav-main-item">
                <Link className="nav-main-link"  onClick={this.closeMenu}
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
                    <Link className="nav-main-link" to={`/books`}  onClick={this.closeMenu}>
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

    toggleMenuOpen = () => this.setState({ submenuOpen: !this.state.submenuOpen });
    closeMenu = () => this.props.closeSidebarCompact();
    render() {
        const { categories } = this.props;
        const { submenuOpen } = this.state;
        return (
            <li key="books" className={`nav-main-item ${submenuOpen ? 'open' : null}`}>
                <a className="nav-main-link nav-main-link-submenu" onClick={this.toggleMenuOpen} aria-haspopup="true" aria-expanded="false" href="#">
                    <i className="nav-main-link-icon si si-book-open"/>
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
        closeSidebarCompact: closeSidebarCompact
    }, dispatch)
)(BooksMenu));
