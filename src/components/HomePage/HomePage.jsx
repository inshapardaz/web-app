import React from 'react';
import { Helmet } from 'react-helmet'

import LatestBooks from './LatestBooks.jsx';
import RecentBooks from './RecentBooks.jsx';
import FavoriteBooks from './FavoriteBooks.jsx';

import Page from '../Layout/Page.jsx';
import './style.scss';

class HomePage extends React.Component {
  render() {
    return (
      <div>
        <div className="cwt__preview">
          <Helmet title="Home" />
          <div className="cwt__preview__container">
            <div className="cwt__preview__title">
              انشاپرداز
          </div>
            <a href="/books" className="btn btn-primary cwt__action__button">
              مطالعہ شروع کریں
          </a>
            <div className="cwt__preview__contents">

            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <LatestBooks />
          </div>
          <div className="row">
            <RecentBooks />
          </div>
          <div className="row">
            <FavoriteBooks />
          </div>
        </div>
      </div >
    );
  }
}

export default HomePage;
