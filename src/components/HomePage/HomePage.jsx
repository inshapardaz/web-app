import React from 'react';
import { Helmet } from 'react-helmet'

import LatestBooks from './LatestBooks.jsx';
import RecentBooks from './RecentBooks.jsx';
import FavoriteBooks from './FavoriteBooks.jsx';

class HomePage extends React.Component {
  componentDidMount(){
    console.log('component did mount');
  }

  componentWillUnmount(){
    console.log('component unmounted');
  }
  render() {
    return (
      <div>
        <Helmet title="Home" />
        <h2>Welcome</h2>

        <LatestBooks />

        <RecentBooks />

        <FavoriteBooks />

      </div>
    );
  }
}

export default HomePage;
