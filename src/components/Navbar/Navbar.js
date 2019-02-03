import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Responsive, Menu, Icon } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl';

import NavbarChildren from './NavbarChildren'
import NavbarDesktop from './NavbarDesktop'
import NavbarMobile from './NavbarMobile'
import ProfileMenu from './ProfileMenu';
import Footer from './Footer';

export default class NavBar extends Component {
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

  handleToggle = () => this.setState({ visible: !this.state.visible });

  renderMenuItems() {
    return [
      (<Menu.Item key="book" as={Link} to="/books">
        <Icon name="book" />
        <FormattedMessage id="header.books" />
      </Menu.Item>),
      (<Menu.Item key="authors" as={Link} to="/authors">
        <Icon name="users" />
        <FormattedMessage id="header.authors" />
      </Menu.Item>)];
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
        <Footer />
      </div>
    )
  }
}
