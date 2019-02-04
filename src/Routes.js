import React from 'react'
import { Route, Switch } from 'react-router'

import HomePage from "./components/HomePage/HomePage";
import NotFoundPage from './components/NotFoundPage/NotFound';
import Callback from './components/Callback';

import AuthorHome from './components/Authors/AuthorHome';
import AuthorPage from './components/Authors/AuthorPage';
import BookPage from './components/Books/BookPage';
import BooksHome from './components/Books/BooksHome';

import ChapterEditor from './components/Chapter/ChapterEditor';
import Chapter from './components/Chapter/Chapter';

import DictionaryHome from './components/Dictionary/DictionaryHome';
import DictionaryPage from './components/Dictionary/DictionaryPage';

import CategoriesHome from './components/Categories/CategoriesHome';

import ErrorPage from './components/ErrorPage';
import AboutPage from './components/AboutPage';

class Routes extends React.Component {
    
  render() {
    return (
      <Switch>
        <Route path="/callback" component={Callback} exact />
        <Route path="/" component={HomePage} exact />
        <Route path="/about" component={AboutPage} exact /> 
        <Route path="/error" component={ErrorPage} exact />        
        <Route path="/authors/:id" component={AuthorPage} />
        <Route path="/authors" component={AuthorHome} />
        <Route path="/books/:id/chapters/:chapterId/edit" component={ChapterEditor} />
        <Route path="/books/:id/chapters/:chapterId" component={Chapter} />
        <Route path="/books/:id" component={BookPage} />
        <Route path="/books/new" component={BooksHome} />
        <Route path="/books/recent" component={BooksHome} />
        <Route path="/books/favorites" component={BooksHome} />
        <Route path="/books" component={BooksHome} />
        <Route path="/categories" component={CategoriesHome} />
        <Route path="/dictionaries/:id" component={DictionaryPage} />
        <Route path="/dictionaries" component={DictionaryHome} />
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