import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { IntlProvider } from 'react-intl';
import { getEntry } from './actions/dataActions';
import Routes from './Routes';
import LocaleService from './services/LocaleService';
import AuthService from './services/AuthService';
import { push } from 'connected-react-router'
import ReduxToastr from 'react-redux-toastr';
import './styling/styles.css';

class App extends React.Component {
  state = {
    isLoading: false,
    locale: null
  };

  async componentDidMount() {


    if (localStorage.getItem('isLoggedIn') === 'true') {
      AuthService.renewSession();
    }

    this.setState({
      isLoading: true
    });

    var locale = await LocaleService.initLocale();

    this.setState({
      locale: locale
    });

    try {
      await this.props.getEntry();
      this.setState({
        isLoading: false
      });
    }
    catch(e)
    {
      console.error('error', e)
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
        <div id="tg-wrapper" className="tg-wrapper tg-haslayout">
        <IntlProvider locale={locale.locale} messages={locale.messages}>
          <>
            <Routes />
            <ReduxToastr
                timeOut={4000}
                newestOnTop={false}
                preventDuplicates
                position="top-left"
                transitionIn="fadeIn"
                transitionOut="fadeOut"
                progressBar
                closeOnToastrClick/>
          </>
        </IntlProvider>
        </div>
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
