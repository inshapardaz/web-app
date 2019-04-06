import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Navbar, Nav } from 'react-bootstrap';
import logo from 'resources/logo.png';
import BooksMenu from '../Books/BooksMenu';
import { Icon } from 'semantic-ui-react'
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
							<strong className="tg-logo"><a href="/"><img src="images/logo.png" alt="company name here"/></a></strong>
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
    return (
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="#home">
          <img
            alt=""
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />
          <FormattedMessage id="app" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <BooksMenu />
            <Nav.Link as={Link} to="/authors"> <Icon name='users' /> Authors</Nav.Link>
            <Nav.Link as={Link} to="/series"> <Icon name='chain' /> Series</Nav.Link>
            {this.renderCategories()}
          </Nav>
          <SearchBox />
          <ProfileMenu />
        </Navbar.Collapse>
      </Navbar>
    )
  }
}



export default (connect(
  (state) => ({
    categories: state.apiReducers.categories
  }),
  dispatch => bindActionCreators({
  }, dispatch)
)(Header));
