import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Responsive } from 'semantic-ui-react'

import NavbarChildren from './NavbarChildren'
import NavbarDesktop from './NavbarDesktop'
import NavbarMobile from './NavbarMobile'
import ProfileMenu from './ProfileMenu';

export default class NavBar extends Component {
  static propTypes = {
    children: PropTypes.node,
  }

  constructor(props){
    super(props);

    this.leftItems = [
      {
        as: 'a',
        content: 'Book',
        href: '/books',
        icon: 'book',
        key: 'books'
      }, {
        as: 'a',
        content: 'Authors',
        href: '/authors',
        icon: 'users',
        key: 'authors'
      }]
    }

  state = {
    visible: false
  };

  handlePusher = () => {
    const { visible } = this.state

    if (visible) this.setState({ visible: false })
  };

  handleToggle = () => this.setState({ visible: !this.state.visible });

  render() {
    const { children } = this.props
    const { visible } = this.state
    const rightItems = <ProfileMenu />;
    return (
      <div>
        <Responsive {...Responsive.onlyMobile}>
          <NavbarMobile
            leftItems={this.leftItems}
            onPusherClick={this.handlePusher}
            onToggle={this.handleToggle}
            rightItems={rightItems}
            visible={visible}
          >
            <NavbarChildren>{children}</NavbarChildren>
          </NavbarMobile>
        </Responsive>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <NavbarDesktop leftItems={this.leftItems} rightItems={rightItems} />
          <NavbarChildren>{children}</NavbarChildren>
        </Responsive>
      </div>
    )
  }
}
