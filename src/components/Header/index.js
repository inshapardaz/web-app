import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleSidebar, toggleSidebarCompact } from '../../actions/uiActions';
import ProfileMenu from './ProfileMenu';
import SearchBox from './SearchBox';
import SearchOverlay from './SearchOverlay';

class Header extends Component {
	onToggle() {
		this.props.toggleSidebar();
	}
	onToggleCompact(){
		this.props.toggleSidebarCompact();
	}

	render() {
		return (
			<header id="page-header">
				<div className="content-header">
					<div className="d-flex align-items-center">
						<button type="button" className="btn btn-sm btn-dual mr-2 d-lg-none" onClick={this.onToggleCompact.bind(this)}>
							<i className="fa fa-fw fa-bars mr-2"></i>
						</button>
						<button type="button" className="btn btn-sm btn-dual mr-2 d-none d-lg-inline-block" onClick={this.onToggle.bind(this)}>
							<i className="fa fa-fw fa-ellipsis-v"></i>
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
    state => ({}),
    dispatch => bindActionCreators({
			toggleSidebar : toggleSidebar,
			toggleSidebarCompact : toggleSidebarCompact
    }, dispatch)
)(Header));