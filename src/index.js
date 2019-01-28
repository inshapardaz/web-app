import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './App'

import configureStore from './store/configureStore';

const store = configureStore();

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component store={store} />    
    </AppContainer>,
    document.getElementById('root'),
  )
}

render(App)
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./App', () => { render(App) })
}
