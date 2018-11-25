import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getRecentBook } from '../../actions/api';

class RecentBooks extends React.Component
{
  async componentDidMount()
  {
    this.setState({
      isLoading : true
    });
    try
    {
      await this.props.getRecentBook();
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
    if (this.props.isLoading || !this.props.recentBooks)
    {
      return <div>Loading...</div>
    }
    else if (this.props.isError){
      return <div>Error loading recent books</div> ;
    }
    else
    {
      if (this.props.recentBooks.length > 0)
      {
        var items = this.props.recentBooks.map(item => <li key={item.id}>{item.name}</li>);
        return <ul>{items}</ul>
      }
      else
      {
        return <div>No recently read book. Why not start reading some books.</div>
      }
    }
  }
}

export default connect(
  state => ({
    isLoading : state.isLoading,
    recentBooks : state.apiReducer.recentBooks
  }),
  dispatch => bindActionCreators({
    getRecentBook
  }, dispatch))(RecentBooks)
