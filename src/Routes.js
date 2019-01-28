import React from 'react'
import { Route, Switch } from 'react-router'

import HomePage from "./components/HomePage/HomePage";
import NotFoundPage from './components/NotFoundPage/NotFound';
import Callback from './components/Callback';


const loadableRoutes = {
  /*'/callback': {
    component: loadable(() => import('./Callback.jsx')),
    exact: true
  },
  '/silent_renew': {
    component: loadable(() => import('./silentRefresh.jsx')),
    exact: true
  },

  '/books/:id/chapters/:chapterId/edit': {
    component: loadable(() => import('./Chapter/ChapterEditor.jsx')),
  },
  '/books/:id/chapters/:chapterId': {
    component: loadable(() => import('./Chapter/Chapter.jsx')),
  },
  '/books/:id': {
    component: loadable(() => import('./Books/BookPage.jsx')),
  },
  '/books/new': {
    component: loadable(() => import('./Books/BooksHome.jsx')),
  },
  '/books/favorites': {
    component: loadable(() => import('./Books/BooksHome.jsx')),
  },
  '/books/recents': {
    component: loadable(() => import('./Books/BooksHome.jsx')),
  },
  '/books': {
    component: loadable(() => import('./Books/BooksHome.jsx')),
    exact:true
  },
  '/authors/:id': {
    component: loadable(() => import('./Authors/AuthorPage.jsx')),
  },
  '/authors': {
    component: loadable(() => import('./Authors/AuthorsHome.jsx')),
  },
  '/dictionaries/:id': {
    component: loadable(() => import('./Dictionary/DictionaryPage.jsx')),
  },
  '/dictionaries': {
    component: loadable(() => import('./Dictionary/DictionaryHome.jsx')),
  },
  '/categories': {
    component: loadable(() => import('./Categories/CategoriesHome.jsx')),
  },
  '/about': {
    component: loadable(() => import('./AboutPage')),
  },
  '/error': {
    component: loadable(() => import('./ErrorPage.jsx')),
  }*/
}

class Routes extends React.Component {
    
  render() {
    return (
      <Switch>
        <Route exact path="/callback" component={Callback} />
        <Route exact path="/" component={HomePage} />
        <Route 
          render={() => (
            <NotFoundPage />
          )}
        />
      </Switch>
    )
  }
}

export default Routes