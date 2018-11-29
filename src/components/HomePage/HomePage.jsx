import React from 'react';
import { Helmet } from 'react-helmet'

import LatestBooks from './LatestBooks.jsx';
import RecentBooks from './RecentBooks.jsx';
import FavoriteBooks from './FavoriteBooks.jsx';

import Page from '../Layout/Page.jsx';

class HomePage extends React.Component {
  componentDidMount(){
    console.log('component did mount');
  }

  componentWillUnmount(){
    console.log('component unmounted');
  }
  render() {
    return (
      <Page>
        <Helmet title="Home" />
        <LatestBooks />
        <RecentBooks />
        <FavoriteBooks />
      </Page>
    );
  }
}

export default HomePage;
