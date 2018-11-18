import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import { OidcProvider } from 'redux-oidc';
import App from './App';
import userManager from "../utils/userManager";

export default class Root extends Component {
  render() {
    const { store, history } = this.props;
    return (
      <Provider store={store}>
        {/* <OidcProvider userManger={userManager} store={store}> */}
          <ConnectedRouter history={history}>
            <App />
          </ConnectedRouter>
        {/* </OidcProvider> */}
      </Provider>
    );
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};
