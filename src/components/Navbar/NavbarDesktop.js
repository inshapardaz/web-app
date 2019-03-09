import React from 'react'
import {Link} from 'react-router-dom';
import { Container, Image, Menu, Input } from 'semantic-ui-react'

import CategoriesDropDown from './CategoriesDropDown';
import logo from 'resources/logo.png'
import {injectIntl, FormattedMessage} from 'react-intl';
import SearchBox from './SearchBox';

const NavbarDesktop = ({ leftItems, rightItems, intl }) => {
  return (<Menu fixed='top' inverted>
    <Container>
      <Menu.Item as={Link} to="/">
        <Image size='mini' src={logo} style={{ margin: '0 1.5em' }}/> <FormattedMessage id="app"/>
      </Menu.Item>
      {leftItems}
      <CategoriesDropDown />
      <Menu.Menu position='right'>
        <Menu.Item>
          <SearchBox  />
        </Menu.Item>
        {rightItems}
      </Menu.Menu>
    </Container>
  </Menu>)
  }

export default injectIntl(NavbarDesktop)
