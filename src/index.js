/* eslint-disable import/default */

import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import configureStore, { history } from './store/configureStore';
import App from './components/App.jsx';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './styles/styles.scss';

require('./favicon.ico');
const store = configureStore();

render(
  <AppContainer>
    <App store={store} history={history} />
  </AppContainer>,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept('./components/Layout/Root', () => {
    const NewApp = require('./components/App.jsx').default;
    render(
      <AppContainer>
        <NewApp store={store} history={history} />
      </AppContainer>,
      document.getElementById('app')
    );
  });
}
