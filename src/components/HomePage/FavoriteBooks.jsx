import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getFavoriteBook } from '../../actions/api';

class FavoriteBooks extends React.Component
{
  async componentDidMount()
  {
    this.setState({
      isLoading : true
    });
    try
    {
      await this.props.getFavoriteBook();
    }
    catch(error)
    {
      this.setState({
        isError : true
      });
    }

    this.setState({
      isLoading : true
    });
  }

  render()
  {
    if (this.props.isLoading || !this.props.favoriteBooks)
    {
      return <div>Loading...</div>;
    }
    else if (this.props.isError){
      return <div>Error loading favorites</div> ;
    }
    else
    {
      if (this.props.favoriteBooks.length > 0)
      {
        var items = this.props.favoriteBooks.map(item => <li key={item.id}>{item.name}</li>);
        return <ul>{items}</ul>
      }
      else
      {
        return <div>No favorites found.</div>
      }
    }
  }
}

export default connect(
  state => ({
    isLoading : state.isLoading,
    favoriteBooks : state.apiReducer.favoriteBooks
  }),
  dispatch => bindActionCreators({
    getFavoriteBook
  }, dispatch))(FavoriteBooks)
