import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Segment } from 'semantic-ui-react'

import { IntlProvider } from 'react-intl';
import {getEntry} from './actions/dataActions';

import { Navbar } from 'components'
import 'styling/semantic.less'
import Routes from './Routes';
import LocaleService from './services/LocaleService';

import { push } from 'connected-react-router'

const leftItems = [
  {
    as: 'a',
    content: 'Book',
    href: '/books',
    icon: 'book',
    key: 'books'
  }, {
    as: 'a',
    content: 'Authors',
    href: '/authors',
    icon: 'users',
    key: 'authors'
  }
]
const rightItems = [
  {
    as: 'a',
    content: 'Github',
    href: 'https://github.com/Semantic-Org/Semantic-UI-React',
    icon: 'github',
    key: 'github',
    target: '_blank',
  },
  {
    as: 'a',
    content: 'Stack Overflow',
    icon: 'stack overflow',
    href: 'https://stackoverflow.com/questions/tagged/semantic-ui-react?sort=votes',
    key: 'so',
    target: '_blank',
  },
]


class App extends React.Component {
  state = {
    isLoading: false,
    locale: null
  };

  async componentDidMount() {
    this.setState({
      isLoading: true
    });

    let localSetting = new LocaleService();
    var locale = await localSetting.initLocale();

    this.setState({
      locale : locale
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
          <Navbar leftItems={leftItems} rightItems={rightItems}>
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
