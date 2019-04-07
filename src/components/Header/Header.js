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
    var categories = null;
    if (this.props.categories && this.props.categories.links.create) {
      categories = (<li><Link to="/categories"><FormattedMessage id="header.categories" /></Link></li>);
    }
    return categories;
  }

  render() {

    return (
      <header id="tg-header" className="tg-header tg-headervtwo tg-haslayout">
			<div className="tg-middlecontainer">
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
