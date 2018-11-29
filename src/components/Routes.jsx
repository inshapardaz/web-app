import React from 'react'
import { Route } from 'react-router-dom'
import { ConnectedSwitch } from '../utils/reactRouterConnected'
import Loadable from 'react-loadable'
import NotFoundPage from "./NotFoundPage";
import HomePage from "./HomePage/HomePage.jsx";

const loadable = loader =>
  Loadable({
    loader,
    delay: false,
    loading: () => null,
  })

const loadableRoutes = {
  '/callback': {
    component: loadable(() => import('./Callback')),
    exact: true
  },
  '//silent_renew': {
    component: loadable(() => import('./silentRefresh')),
    exact: true
  },
  '/books/:id': {
    component: loadable(() => import('./Books/BookPage.jsx')),
  },
  '/books': {
    component: loadable(() => import('./Books/BookPage.jsx')),
  },
  '/authors/:id': {
    component: loadable(() => import('./Authors/AuthorPage.jsx')),
  },
  '/authors': {
    component: loadable(() => import('./Authors/AuthorsHome.jsx')),
  },
  '/about': {
    component: loadable(() => import('./AboutPage')),
  },
  '/error': {
    component: loadable(() => import('./ErrorPage')),
  }
}

class Routes extends React.Component {
  timeoutId = null

  componentDidMount() {
    this.timeoutId = setTimeout(
      () => Object.keys(loadableRoutes).forEach(path => loadableRoutes[path].component.preload()),
      5000, // load after 5 sec
    )
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }
  }

  render() {
    return (
      <ConnectedSwitch>
        <Route exact path="/" component={HomePage} />
        {Object.keys(loadableRoutes).map(path => {
          const { exact, ...props } = loadableRoutes[path]
          props.exact = exact === void 0 || exact || false // set true as default
          return <Route key={path} path={path} {...props} />
        })}
        <Route
          render={() => (
            <NotFoundPage />
          )}
        />
      </ConnectedSwitch>
    )
  }
}

export { loadableRoutes }
export default Routes
