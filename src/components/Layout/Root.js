import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ConnectedRouter } from 'connected-react-router';
import { OidcProvider } from 'redux-oidc';
import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet'
import { LocaleProvider } from 'antd'
import enGB from 'antd/lib/locale-provider/en_GB'

import userManager from '../../utils/userManager';
import Layout from './Layout.jsx'

export default class Root extends Component {
  render() {
    const { store, history } = this.props;
    return (
      <Provider store={store}>
        <OidcProvider userManager={userManager} store={store}>
          <ConnectedRouter history={history}>
            <LocaleProvider locale={enGB}>
              <div>
                <Helmet titleTemplate="Clean UI - %s" />
                <Layout />
              </div>
            </LocaleProvider>
          </ConnectedRouter>
        </OidcProvider>
      </Provider>
    );
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};
