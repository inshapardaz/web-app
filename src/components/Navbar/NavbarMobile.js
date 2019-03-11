import PropTypes from 'prop-types'
import React from 'react'
import { Icon, Image, Menu, Sidebar } from 'semantic-ui-react'

import logo from 'resources/logo.png'
import * as styles from './NavbarMobile.less'
import ProfileMenu from  './ProfileMenu';
import BooksMenu from '../Books/BooksMenu';

const NavbarMobile = ({ children, leftItems, onPusherClick, onToggle, visible }) => (
  <Sidebar.Pushable>
    <Sidebar
      as={Menu}
      animation='overlay'
      icon='labeled'
      inverted
      vertical
      visible={visible}
    >
    <BooksMenu key="books" isMobile />
      {leftItems}
    </Sidebar>
    <Sidebar.Pusher dimmed={visible} onClick={onPusherClick} className={styles.pusher}>
      <Menu inverted>
        <Menu.Item href="/">
          <Image size='mini' src={logo} />
        </Menu.Item>
        <ProfileMenu isMobile={true}/>
        <Menu.Menu  position='right' fixed='right'>
          <Menu.Item onClick={onToggle}>
            <Icon name='sidebar' />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
      {children}
    </Sidebar.Pusher>
  </Sidebar.Pushable>
)

NavbarMobile.propTypes = {
  children: PropTypes.node,
  leftItems: PropTypes.arrayOf(PropTypes.object),
  onPusherClick: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
}

export default NavbarMobile
