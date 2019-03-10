import React from 'react'
import {Link} from 'react-router-dom';
import { Image, Menu } from 'semantic-ui-react'

import logo from 'resources/logo.png'
import {injectIntl, FormattedMessage} from 'react-intl';
import SearchBox from './SearchBox';
import CategoriesDropDown from './CategoriesDropDown';

const NavbarDesktop = ({ leftItems, rightItems, intl }) => {
  return (<Menu fixed='top' inverted size='small'>
      <Menu.Item as={Link} to="/">
        <Image size='mini' src={logo} style={{ margin: '0 1.5em' }}/> <FormattedMessage id="app"/>
      </Menu.Item>
      {leftItems}
      <CategoriesDropDown key="categories" />
      <Menu.Menu position='right'>
        <Menu.Item>
          <SearchBox  />
        </Menu.Item>
        {rightItems}
      </Menu.Menu>
  </Menu>)
  }

export default injectIntl(NavbarDesktop)
