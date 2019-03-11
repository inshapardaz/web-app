import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { Responsive, Menu, Icon, MenuItem } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl';

import NavbarChildren from './NavbarChildren'
import NavbarDesktop from './NavbarDesktop'
import NavbarMobile from './NavbarMobile'
import ProfileMenu from './ProfileMenu';

class NavBar extends Component {
  static propTypes = {
    children: PropTypes.node,
  }

  state = {
    visible: false
  };

  handlePusher = () => {
    const { visible } = this.state

    if (visible) this.setState({ visible: false })
  };

  handleToggle = () => {
    console.log('menu', this.state.visible)
    this.setState({ visible: !this.state.visible });
  }

  renderMenuItems() {
    var categories = null;
    if (this.props.categories && this.props.categories.links.create){
      categories = (<Menu.Item key="0" as={Link} to={`/categories`} >
      <Icon name='folder outline' /><FormattedMessage id="header.categories" /></Menu.Item>);
    }

    return [
      (<Menu.Item key="authors" as={Link} to="/authors">
        <Icon name="users" />
        <FormattedMessage id="header.authors" />
      </Menu.Item>), categories];
  }
  render() {
    const { children } = this.props
    const { visible } = this.state
    const rightItems = <ProfileMenu />;
    const leftItems = this.renderMenuItems();
    return (
      <div>
        <Responsive {...Responsive.onlyMobile}>
          <NavbarMobile
            leftItems={leftItems}
            onPusherClick={this.handlePusher}
            onToggle={this.handleToggle}
            rightItems={rightItems}
            visible={visible}
          >
            <NavbarChildren>{children}</NavbarChildren>
          </NavbarMobile>
        </Responsive>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <NavbarDesktop leftItems={leftItems} rightItems={rightItems} />
          <NavbarChildren>{children}</NavbarChildren>
        </Responsive>
      </div>
    )
  }
}


export default (connect(
  (state) => ({
      categories: state.apiReducers.categories
  }),
  dispatch => bindActionCreators({
  }, dispatch)
)(NavBar));