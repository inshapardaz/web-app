import '@babel/polyfill';
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './App'

import { Provider } from 'react-redux';

import configureStore from './store/configureStore';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css'
import "antd/dist/antd.css";

const store = configureStore();

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
          <Component />
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