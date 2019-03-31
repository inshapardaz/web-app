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
import SearchBox from '../Navbar/SearchBox';

class Header extends Component {
  renderCategories() {
    var categories = null;
    if (this.props.categories && this.props.categories.links.create) {
      categories = (<Nav.Link as={Link} to={`/categories`} > <Icon name='folder outline' /> <FormattedMessage id="header.categories" /></Nav.Link>);
    }
    return categories;
  }
  render() {
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
