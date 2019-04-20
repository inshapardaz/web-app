import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import BooksMenu from '../Books/BooksMenu';
import ProfileMenu from './ProfileMenu';
import SearchBox from './SearchBox';

class Header extends Component {
	renderCategories() {
		if (this.props.categories && this.props.categories.links.create) {
			return (
				<Link to="/categories" className="btn btn-sm btn-dual mr-2">
					<i className="fa fa-boxes mr-2"></i>
				</Link>
			);
		}

		return null;
	}

	render() {

		return (
			<header id="page-header">
			<div className="content-header">
				<div className="d-flex align-items-center">
					<button type="button" className="btn btn-sm btn-dual mr-2 d-lg-none" data-toggle="layout" data-action="sidebar_toggle">
						<i className="fa fa-fw fa-bars mr-2"></i>
					</button>
					<button type="button" className="btn btn-sm btn-dual mr-2 d-none d-lg-inline-block" data-toggle="layout" data-action="sidebar_mini_toggle">
						<i className="fa fa-fw fa-ellipsis-v"></i>
					</button>
					<BooksMenu />
					<Link to="/authors" className="btn btn-sm btn-dual mr-2">
						<i className="fa fa-user-friends mr-2"></i>
					</Link>
					<Link to="/series" className="btn btn-sm btn-dual mr-2">
						<i className="si si-link mr-2"></i>
					</Link>
					{this.renderCategories()}
					<SearchBox />
				</div>
				<div className="d-flex align-items-center">
					<ProfileMenu />
				</div>
				{/* <div className="tg-middlecontainer">
				<div className="container">
					<div className="row">
						<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
							<strong className="tg-logo"><a href="/"><img src="/images/logo.png" alt="company name here"/></a></strong>
							<SearchBox />
						</div>
					</div>
				</div>
			</div>
			<div className="tg-navigationarea">
				<div className="container">
					<div className="row">
						<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
							<div className="tg-navigationholder">
								<nav id="tg-nav" className="tg-nav">
									<div className="navbar-header">
										<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#tg-navigation" aria-expanded="false">
											<span className="sr-only">Toggle navigation</span>
											<span className="icon-bar"></span>
											<span className="icon-bar"></span>
											<span className="icon-bar"></span>
										</button>
									</div>
									<div id="tg-navigation" className="collapse navbar-collapse tg-navigation">
										<ul>
                    <BooksMenu />
										<li><Link to="/authors"><FormattedMessage id="header.authors" /></Link></li>
										<li><Link to="/series"><FormattedMessage id="header.series" /></Link></li>
                    {this.renderCategories()}
									</ul>
									</div>
								</nav>
								<div className="tg-wishlistandcart">
                  <ProfileMenu />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div> */}
			</div>
			</header>
		);
	}
}



export default (connect(
	(state) => ({
		categories: state.apiReducers.categories
	}),
	dispatch => bindActionCreators({
	}, dispatch)
)(Header));
