import React from 'react'
import { Switch } from 'react-router'

import { BoxedLayout, EmptyLayout, FullScreenLayout } from './components/Layouts';

import HomePage from "./components/HomePage/HomePage";
import Callback from './components/Callback';

import AuthorHome from './components/Authors/AuthorHome';
import AuthorPage from './components/Authors/AuthorPage';
import BookPage from './components/Books/BookPage';
import BooksHome from './components/Books/BooksHome';

import ChapterContentEditor from './components/Chapter/ChapterContentEditor';
import Chapter from './components/Chapter/Chapter';

import DictionaryHome from './components/Dictionary/DictionaryHome';
import DictionaryPage from './components/Dictionary/DictionaryPage';

import CategoriesPage from './components/Categories/CategoriesPage';
import SeriesPage from './components/Series/SeriesPage';

import Search from './components/Search';
import ErrorPage from './components/Pages/ErrorPage';
import NotFoundPage from './components/Pages/NotFound';
import AboutPage from './components/Pages/AboutPage';
import RouteWithLayout from './components/Layouts/RouteWithLayout';

class Routes extends React.Component {
    
  render() {
    return (
      <Switch>
        <RouteWithLayout layout={EmptyLayout} path="/callback" component={Callback} exact/>
        <RouteWithLayout layout={FullScreenLayout} path="/" component={HomePage} exact />
        <RouteWithLayout layout={FullScreenLayout} path="/about" component={AboutPage} exact /> 
        <RouteWithLayout layout={EmptyLayout} path="/error" component={ErrorPage} exact />   
        <RouteWithLayout layout={BoxedLayout} path="/search" component={Search} exact />
        <RouteWithLayout layout={BoxedLayout} path="/authors/:id" component={AuthorPage} />
        <RouteWithLayout layout={BoxedLayout} path="/authors" component={AuthorHome} />
        <RouteWithLayout layout={EmptyLayout} path="/books/:id/chapters/:chapterId" component={Chapter} />
        <RouteWithLayout layout={BoxedLayout} path="/books/:id" component={BookPage} />
        <RouteWithLayout layout={BoxedLayout} path="/books/new" component={BooksHome} />
        <RouteWithLayout layout={BoxedLayout} path="/books/recent" component={BooksHome} />
        <RouteWithLayout layout={BoxedLayout} path="/books/favorites" component={BooksHome} />
        <RouteWithLayout layout={BoxedLayout} path="/books" component={BooksHome} />
        <RouteWithLayout layout={BoxedLayout} path="/categories" component={CategoriesPage} />
        <RouteWithLayout layout={BoxedLayout} path="/series" component={SeriesPage} />
        <RouteWithLayout layout={BoxedLayout} path="/dictionaries/:id" component={DictionaryPage} />
        <RouteWithLayout layout={BoxedLayout} path="/dictionaries" component={DictionaryHome} />
        <RouteWithLayout layout={EmptyLayout} component={NotFoundPage} />
      </Switch>
    )
  }
}

export default Routes