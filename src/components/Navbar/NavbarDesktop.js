import _ from 'lodash'
import React from 'react'
import { Container, Image, Menu, Input } from 'semantic-ui-react'

import CategoriesDropDown from './CategoriesDropDown';
import logo from 'resources/logo.png'
import {FormattedMessage} from 'react-intl';

const NavbarDesktop = ({ leftItems, rightItems }) => (
  <Menu fixed='top' inverted>
    <Container>
      <Menu.Item href="/">
        <Image size='mini' src={logo} style={{ marginRight: '1.5em' }}/> <FormattedMessage id="app"/>
      </Menu.Item>
      {_.map(leftItems, item => <Menu.Item {...item} />)}
      <CategoriesDropDown />
      <Menu.Menu position='right'>
        <Menu.Item>
            <Input icon='search' placeholder='Search...' />
        </Menu.Item>
        {rightItems}
      </Menu.Menu>
    </Container>
  </Menu>
)

export default NavbarDesktop
