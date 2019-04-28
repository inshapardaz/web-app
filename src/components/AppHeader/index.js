import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleSidebar, toggleSidebarCompact } from '../../actions/uiActions';
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl';


import { Layout, Menu, Icon } from 'antd';

const { Header } = Layout;

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

import ProfileMenu from './ProfileMenu';
import SearchBox from './SearchBox';
import SearchOverlay from './SearchOverlay';

class AppHeader extends Component {
	onToggle() {
		this.props.toggleSidebar();
	}
	onToggleCompact() {
		this.props.toggleSidebarCompact();
	}

	renderBooks() {
		return (
			<SubMenu title={<span className="submenu-title-wrapper"><Icon type="book" /><FormattedMessage id="header.books" /></span>}>
				<Menu.Item key="new">
					<Link to="/books/new">
						<Icon type="star" />
						<FormattedMessage id="home.latestBooks" />
					</Link>
				</Menu.Item>
				<Menu.Item key="recent">
					<Link to="/books/recent">
						<Icon type="clock-circle" />
						<FormattedMessage id="home.recent" />
					</Link>
				</Menu.Item>
				{this.props.entry && this.props.entry.links.favorites
					? (<Menu.Item key="favorites">
						<Link to="/books/favorites">
							<Icon type="heart" />
							<FormattedMessage id="home.favoriteBooks" />
						</Link>
					</Menu.Item>)
					: null
				}
				<Menu.Item key="allbooks">
					<Link to="/books">
						<Icon type="book" />
						<FormattedMessage id="header.books.list" />
					</Link>
				</Menu.Item>
				<Menu.Divider></Menu.Divider>
				<SubMenu title={<span className="submenu-title-wrapper">
					<Icon type="appstore" />
					<FormattedMessage id="header.categories" /></span>}>
					{this.renderCategoriesMenu()}
				</SubMenu>
			</SubMenu>
		);
	}

	renderCategoriesMenu() {
		if (this.props.categories) {

			return this.props.categories.items.map(c => (
				<Menu.Item key={c.id}>
					<Link to={`/books?category=${c.id}`}>
						{c.name}
					</Link>
				</Menu.Item>
			));
		}

		return null;
	}
	renderCategories() {
		if (this.props.categories && this.props.categories.links.create) {
			return (
				<Menu.Item key="categories">
					<Link to="/categories">
						<Icon type="appstore" /><FormattedMessage id="header.categories" />
					</Link>
				</Menu.Item>
			);
		}

		return null;
	}

	render() {

		return (
			<Header>
				<Menu
					theme="dark"
					mode="horizontal"
					defaultSelectedKeys={['2']}
					style={{ lineHeight: '64px' }}
				>
					<Menu.Item style={{ backgroundColor: "rgba(255,255,255,.2)" }}>
						<Link to="/">
							<img height="24" width="24" src="/resources/img/logo.png" style={{ marginRight: "4px" }} />
							<FormattedMessage id="app" />
						</Link>
					</Menu.Item>
					{this.renderBooks()}
					<Menu.Item key="authors">
						<Link to="/authors">
							<Icon type="user" /> <FormattedMessage id="header.authors" />
						</Link>
					</Menu.Item>
					<Menu.Item key="series">
						<Link to="/series">
							<Icon type="link" /><FormattedMessage id="header.series" />
						</Link>
					</Menu.Item>
					{this.renderCategories()}
				</Menu>
			</Header>

		)
		return (
			<header id="page-header">
				<div className="content-header">
					<div className="d-flex align-items-center">
						<button type="button" className="btn btn-sm btn-dual mr-2 d-lg-none" onClick={this.onToggleCompact.bind(this)}>
							<i className="fa fa-fw fa-bars" />
						</button>
						<button type="button" className="btn btn-sm btn-dual mr-2 d-none d-lg-inline-block" onClick={this.onToggle.bind(this)}>
							<i className="fa fa-fw fa-ellipsis-v" />
						</button>
						<SearchBox />
					</div>
					<div className="d-flex align-items-center">
						<ProfileMenu />
					</div>
				</div>
				<SearchOverlay />
			</header>
		);
	}
}

export default (connect(
	(state) => ({
		categories: state.apiReducers.categories,
		entry: state.apiReducers.entry
	}),
	dispatch => bindActionCreators({
		toggleSidebar: toggleSidebar,
		toggleSidebarCompact: toggleSidebarCompact
	}, dispatch)
)(AppHeader));