import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getLatestBooks } from '../../actions/api';
import BookBadge from './BookBadge.jsx';

class LatestBooks extends React.Component
{
  async componentDidMount()
  {
    this.setState({
      isLoading : true
    });
    try
    {
      await this.props.getLatestBooks();
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
    if (this.props.isLoading || !this.props.latestBooks)
    {
      return <div>Loading...</div>
    }
    else if (this.props.isError){
      return <div>Error loading latest books</div> ;
    }
    else
    {
      if (this.props.latestBooks.length > 0)
      {
        var items = this.props.latestBooks.map(item => <BookBadge key={item.id} book={item} />);
        return <ul>{items}</ul>
      }
      else
      {
        return <div>No Books found.</div>
      }
    }
  }
}

export default connect(
  state => ({
    isLoading : state.isLoading,
    latestBooks : state.apiReducer.latestBooks
  }),
  dispatch => bindActionCreators({
    getLatestBooks
  }, dispatch))(LatestBooks)
