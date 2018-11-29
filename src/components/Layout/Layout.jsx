import React from 'react';
import PropTypes from 'prop-types'

import { ContainerQuery } from 'react-container-query'
import { Spinner } from 'react-redux-spinner'
import { Layout as AntLayout } from 'antd';
import { enquireScreen, unenquireScreen } from 'enquire-js'

import Loader from './Loader.jsx';
import Menu from './Menu/Menu.jsx'
import TopBar from './TopBar/TopBar.jsx';
import Routes from '../Routes.jsx';
import Footer from './Footer/Footer.jsx';

const AntContent = AntLayout.Content
const AntHeader = AntLayout.Header
const AntFooter = AntLayout.Footer

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
}

let isMobile;
enquireScreen(b => {
  isMobile = b
})

let contentBuffer = {
  pathName: null,
  content: null,
}

class Layout extends React.Component {
  static childContextTypes = {
    getContentBuffer: PropTypes.func,
    setContentBuffer: PropTypes.func,
  }

  state = {
    isMobile,
  }

  getChildContext() {
    return {
      getContentBuffer: () => contentBuffer,
      setContentBuffer: ({ pathName, content }) => (contentBuffer = { pathName, content }),
    }
  }

  componentDidMount() {
    this.enquireHandler = enquireScreen(mobile => {
      this.setState({
        isMobile: mobile,
      })
    })
  }

  componentWillUnmount() {
    unenquireScreen(this.enquireHandler)
  }

  render() {
    const isMobile = !!this.state.isMobile;
    return (
      <ContainerQuery query={query}>
        {params => (
          <AntLayout>
            <Loader />
            <Spinner />
            <Menu isMobile={isMobile} />
            <AntLayout>
              <AntContent style={{ height: '100%' }}>
                <Routes />
              </AntContent>
              <AntFooter>
                <Footer />
              </AntFooter>
            </AntLayout>
          </AntLayout>
        )}
      </ContainerQuery>);
  }
}

export default Layout
