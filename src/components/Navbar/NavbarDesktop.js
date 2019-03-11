import React from 'react'
import {Link} from 'react-router-dom';
import { Image, Menu } from 'semantic-ui-react'

import logo from 'resources/logo.png'
import {injectIntl, FormattedMessage} from 'react-intl';
import SearchBox from './SearchBox';
import BooksMenu from '../Books/BooksMenu';

const NavbarDesktop = ({ leftItems, rightItems, intl }) => {
  return (
    <div style={{display : 'block'}}>
    <Menu inverted size='small'>
      <Menu.Item as={Link} to="/">
        <Image size='mini' src={logo} style={{ margin: '0 1.5em' }}/> <FormattedMessage id="app"/>
      </Menu.Item>
      <BooksMenu key="books" />
      {leftItems}
      <Menu.Menu position='right'>
        <Menu.Item>
          <SearchBox  />
        </Menu.Item>
        {rightItems}
      </Menu.Menu>
    </Menu>
    </div>
  )
  }

export default injectIntl(NavbarDesktop)
