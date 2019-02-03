import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Segment } from 'semantic-ui-react'

import { IntlProvider } from 'react-intl';
import { getEntry } from './actions/dataActions';
import userManager from './services/userManager';
import { Navbar } from 'components'
import 'styling/semantic.less'
import Routes from './Routes';
import LocaleService from './services/LocaleService';

import { push } from 'connected-react-router'

class App extends React.Component {
  state = {
    isLoading: false,
    locale: null
  };

  async componentDidMount() {

    userManager.signinSilent();

    this.setState({
      isLoading: true
    });

    let localSetting = new LocaleService();
    var locale = await localSetting.initLocale();

    this.setState({
      locale: locale
    });

    try {
      await this.props.getEntry();
      this.setState({
        isLoading: false
      });
    }
    catch
    {
      console.log('error')
      this.props.push('/error');
    }

    this.setState({
      isLoading: false
    });
  }

  render() {

    const { isLoading, locale } = this.state;
    if (isLoading) {
      return null;
    }

    if (locale) {
      return (
        <IntlProvider locale={locale.locale} messages={locale.messages}>
          <Navbar>
            <Segment>
              <Routes />
            </Segment>
          </Navbar>
        </IntlProvider>
      );
    }

    return null;
  }
}

export default (connect(
  (state) => ({
    history: state.history,
    entry: state.entry,
    isLoading: state.isLoading,
    user: state.oidc.user
  }),
  dispatch => bindActionCreators({
    getEntry: getEntry,
    push: push
  }, dispatch)
)(App));
