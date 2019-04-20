import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { toggleSidebarCompact } from '../../actions/uiActions';
import BooksMenu from '../Books/BooksMenu';

class SideBar extends Component {
    onToggleCompact(){
		this.props.toggleSidebarCompact();
    }
    
    renderCategories() {
        if (this.props.categories && this.props.categories.links.create) {
            return (
                <li key="categories" className="nav-main-item">
                    <Link to="/categories" className="nav-main-link">
                        <i className="nav-main-link-icon si si-tag"></i>
                        <span className="nav-main-link-name"><FormattedMessage id="header.categories" /></span>
                    </Link>
                </li>
            );
        }

        return null;
    }
    render() {
        return (
            <nav id="sidebar" aria-label="Main Navigation">
                <div className="content-header bg-white-5">
                    <Link className="font-w600 text-dual" to="/">
                        <img className="mr-2" src="/resources/img/logo.png" height="16" width="16"/>
                        <span className="smini-hide">
                            <FormattedMessage id="app" />
                        </span>
                    </Link>
                    <div>
                        <a className="d-lg-none text-dual ml-3" onClick={this.onToggleCompact.bind(this)}>
                            <i className="fa fa-times"></i>
                        </a>
                    </div>
                </div>
                <div className="content-side content-side-full">
                    <ul className="nav-main">
                        <li key="home" className="nav-main-item">
                            <Link className="nav-main-link" to="/">
                                <i className="nav-main-link-icon si si-home"></i>
                                <span className="nav-main-link-name"><FormattedMessage id="header.home" /></span>
                            </Link>
                        </li>
                        <li key="library" className="nav-main-heading"><FormattedMessage id="header.library" /></li>
                        <BooksMenu />
                        <li key="authors" className="nav-main-item">
                            <Link className="nav-main-link" to="/authors">
                                <i className="nav-main-link-icon si si-users"></i>
                                <span className="nav-main-link-name"><FormattedMessage id="header.authors" /></span>
                            </Link>
                        </li>
                        <li key="series" className="nav-main-item">
                            <Link className="nav-main-link" to="/series">
                                <i className="nav-main-link-icon si si-link"></i>
                                <span className="nav-main-link-name"><FormattedMessage id="header.series" /></span>
                            </Link>
                        </li>
                        {this.renderCategories()}
                    </ul>
                </div>
            </nav>
        )
    }
}

export default (connect(
	(state) => ({
		categories: state.apiReducers.categories
	}),
	dispatch => bindActionCreators({
        toggleSidebarCompact : toggleSidebarCompact
	}, dispatch)
)(SideBar));
