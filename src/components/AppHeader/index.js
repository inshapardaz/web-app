import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleSidebar, toggleSidebarCompact } from '../../actions/uiActions';
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl';


import { Menu, Dropdown } from 'antd';
import { HeartOutlined, StarOutlined, ClockCircleOutlined, BookOutlined, AppstoreOutlined } from '@ant-design/icons';


const SubMenu = Menu.SubMenu;

import ProfileMenu from './ProfileMenu';
import SearchBox from './SearchBox';
import LanguageSelector from './LanguageSelector';
import BooksMenu from '../Books/BooksMenu';

const Styles = () => {
	return <style>{`
	.topbar {
		background: #fff;
		padding: 0 10px;
		min-height: 64px;
		height: 64px;
		border-bottom: 1px solid #e4e9f0;
		color: #74708d;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
	}

	.link {
		color: #74708d;
        padding-right: 15px;
        position: relative;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
	}
	
	.dropdown {
        padding-right: 15px;
        position: relative;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
    }
    .dropdown::after {
      color: #d2d9e5;
      position: absolute;
      top: 50%;
      right: 0;
      margin-top: -2px;
      display: inline-block;
      width: 0;
      height: 0;
      margin-left: 0.255em;
      vertical-align: 0.255em;
      content: '';
      border-top: 0.3em solid;
      border-right: 0.3em solid transparent;
      border-bottom: 0;
      border-left: 0.3em solid transparent;
      transition: all 0.2s ease-in-out;
    }
  
	.link:hover,
    .dropdown:hover {
        color: #08f;
	}
	.link:hover::after,
	.link:hover .icon,
    .dropdown:hover::after,
    .dropdown:hover .icon {
        color: #b8beca;
    }
  
    .title {
        display: block;
        padding: rem(8) rem(20);
    }
  
    .icon {
        margin-right: rem(6);
        color: #d2d9e5;
        transition: all 0.2s ease-in-out;
    }
    
    .menuIcon {
        margin-right: rem(5);
    }
	`}</style>
}
class AppHeader extends Component {
	onToggle() {
		this.props.toggleSidebar();
	}
	onToggleCompact() {
		this.props.toggleSidebarCompact();
	}

	renderBooks() {
		return (
			<SubMenu title={<span className="submenu-title-wrapper"><BookOutlined /><FormattedMessage id="header.books" /></span>}>
				<Menu.Item key="new">
					<Link to="/books/new">
						<StarOutlined />
						<FormattedMessage id="home.latestBooks" />
					</Link>
				</Menu.Item>
				<Menu.Item key="recent">
					<Link to="/books/recent">
						<ClockCircleOutlined />
						<FormattedMessage id="home.recent" />
					</Link>
				</Menu.Item>
				{this.props.entry && this.props.entry.links.favorites
					? (<Menu.Item key="favorites">
						<Link to="/books/favorites">
							<HeartOutlined />
							<FormattedMessage id="home.favoriteBooks" />
						</Link>
					</Menu.Item>)
					: null
				}
				<Menu.Item key="allbooks">
					<Link to="/books">
						<BookOutlined />
						<FormattedMessage id="header.books.list" />
					</Link>
				</Menu.Item>
				<Menu.Divider></Menu.Divider>
				<SubMenu title={<span className="submenu-title-wrapper">
					<AppstoreOutlined />
					<FormattedMessage id="header.categories" /></span>}>
					{this.renderCategoriesMenu()}
				</SubMenu>
			</SubMenu>
		);
	}

	renderCategoriesMenu() {
		if (this.props.categories) {

			return this.props.categories.data.map(c => (
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
				<div className="mr-4">
					<Link to="/categories" className="link">
						<i className="fa fa-th-large menuIcon mr-2" />
						<span className="d-none d-xl-inline">
							<strong>
								<FormattedMessage id="header.categories" />
							</strong>
						</span>
					</Link>
				</div>
			);
		}

		return null;
	}

	render() {


		return (
			<>
				<Styles />
				<div className="topbar">
					<Link className="mr-4 ml-4" to="/">
						<img height="24" width="24" src="/resources/img/logo.png" style={{ margin: "4px" }} />
					</Link>
					<div className="mr-4">
						<BooksMenu />
					</div>
					<div className="mr-4">
						<Link to="/authors" className="link">
							<i className="fa fa-user menuIcon mr-2" />
							<span className="d-none d-xl-inline">
								<strong>
									<FormattedMessage id="header.authors" />
								</strong>
							</span>
						</Link>
					</div>
					<div className="mr-4">
						<Link to="/series" className="link">
							<i className="fa fa-link menuIcon mr-2" />
							<span className="d-none d-xl-inline">
								<strong>
									<FormattedMessage id="header.series" />
								</strong>
							</span>
						</Link>
					</div>
					{this.renderCategories()}
					<div className="mr-auto">
						<SearchBox />
					</div>
					<div className="mr-4">
						<LanguageSelector />
					</div>
					<div className="mr-4">
						<ProfileMenu />
					</div>
				</div>
			</>
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