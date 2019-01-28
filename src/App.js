import React from 'react'
import { Segment } from 'semantic-ui-react'

import { OidcProvider } from 'redux-oidc';
import { ConnectedRouter } from 'connected-react-router';
import userManager from './services/userManager';
import { Provider } from 'react-redux';

import {history} from './store/configureStore';
import { Navbar } from 'components'
import 'styling/semantic.less'
import Routes from './Routes';

const leftItems = [
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
  }
]
const rightItems = [
  {
    as: 'a',
    content: 'Github',
    href: 'https://github.com/Semantic-Org/Semantic-UI-React',
    icon: 'github',
    key: 'github',
    target: '_blank',
  },
  {
    as: 'a',
    content: 'Stack Overflow',
    icon: 'stack overflow',
    href: 'https://stackoverflow.com/questions/tagged/semantic-ui-react?sort=votes',
    key: 'so',
    target: '_blank',
  },
]

class App extends React.Component {
  render() {
    return (
      <Provider store={this.props.store}>
      <ConnectedRouter  history={history}>
        <OidcProvider userManager={userManager} store={this.props.store}>
            <Navbar leftItems={leftItems} rightItems={rightItems}>
              <Segment>
                <Routes />  
              </Segment>
            </Navbar>
            </OidcProvider>
          </ConnectedRouter>        
      </Provider>
    );
  }
}

export default App
