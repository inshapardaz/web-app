import '@babel/polyfill';
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './App'

import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import { history } from './store/configureStore';

import configureStore from './store/configureStore';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css'

const store = configureStore();

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <ConnectedRouter history={history}>
            <Component />
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


String.prototype.trunc = 
    function(n){
        return this.substr(0,n-1)+(this.length>n?'...':'');
    };