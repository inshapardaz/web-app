import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { Container, Image, Menu, Input, Dropdown, Icon } from 'semantic-ui-react'

import CategoriesDropDown from './CategoriesDropDown';
import ProfileMenu from './ProfileMenu';
import logo from 'resources/logo.png'

const NavbarDesktop = ({ leftItems, rightItems }) => (
  <Menu fixed='top' inverted>
    <Container>
      <Menu.Item>
        <Image size='mini' src={logo} />
      </Menu.Item>
      {_.map(leftItems, item => <Menu.Item {...item} />)}
      <CategoriesDropDown />
      <Menu.Menu position='right'>
        <Menu.Item>
            <Input icon='search' placeholder='Search...' />
        </Menu.Item>
        <ProfileMenu />
      </Menu.Menu>
    </Container>
  </Menu>
)

NavbarDesktop.propTypes = {
  leftItems: PropTypes.arrayOf(PropTypes.object),
  rightItems: PropTypes.arrayOf(PropTypes.object),
}

export default NavbarDesktop
