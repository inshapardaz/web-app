/* eslint-disable import/no-named-as-default */
import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { hot } from "react-hot-loader";
import { ConnectedRouter } from 'connected-react-router';
import { OidcProvider } from 'redux-oidc';
import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet'
import { LocaleProvider } from 'antd'
import enGB from 'antd/lib/locale-provider/en_GB'

import userManager from '../utils/userManager';
import Layout from './Layout/Layout.jsx'

import { getEntry } from '../actions/api'

class App extends React.Component {
  async componentDidMount(){
    this.setState({
      isLoading : true
    });
    try
    {
      let entry = await this.props.entry();
    }
    catch (error)
    {
      console.log("ERROR" + error);
      this.props.history.push('/error');
    }

    this.setState({
      isLoading : false
    });
  }

  render() {
    const { store, history } = this.props;
    if (this.props.isLoading)
    {
      return <div>Loading...</div>
    }

    return (
      <Provider store={store}>
        <OidcProvider userManager={userManager} store={store}>
          <ConnectedRouter history={history}>
            <LocaleProvider locale={enGB}>
              <div>
                <Helmet titleTemplate="Inshapardaz - %s" />
                <Layout />
              </div>
            </LocaleProvider>
          </ConnectedRouter>
        </OidcProvider>
      </Provider>
    );
  }
}

export default hot(module)(connect(
  (state, props) => ({
    history: state.history,
    entry: state.entry,
    isLoading:  state.isLoading,
    store : props.store,
    history: props.history
  }),
	dispatch => bindActionCreators({
		entry: getEntry
	}, dispatch)
)(App));
