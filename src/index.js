import '@babel/polyfill';
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './App'

import { OidcProvider } from 'redux-oidc';
import { ConnectedRouter } from 'connected-react-router';
import userManager from './services/userManager';
import { Provider } from 'react-redux';
import { history } from './store/configureStore';

import configureStore from './store/configureStore';

const store = configureStore();

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <OidcProvider userManager={userManager} store={store}>
            <Component />
          </OidcProvider>
        </ConnectedRouter>
      </Provider>
    </AppContainer>,
    document.getElementById('root'),
  )
}

render(App)
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./App', () => { render(App) })
}
