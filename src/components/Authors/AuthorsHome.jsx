import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { getAuthors } from '../../actions/api'

class AuthorsHome extends React.Component
{
  async componentDidMount()
  {
    this.setState({
      isLoading : true
    });
    try
    {
      const books = await this.props.getAuthors()
    }
    catch(error)
    {
      this.setState({
        isError : true
      });
    }

    this.setState({
      isLoading : false
    });
  }

  render(){
    if (this.props.isError)
    {
      return <h5>Unable to load authors</h5>;
    }
    else if (this.props.isError || !this.props.authors)
    {
      return <div>Loading...</div>;
    }
    else if ( this.props.authors)
    {
      let authorList = this.props.authors.data.map(b => <li key={b.id}>{b.name}</li>);
      return (
        <div>
          <h2>Authors</h2>
          <ul>
            {authorList}
          </ul>
        </div>
      );
    }
    return null;
  }
}

export default (withRouter(connect(
  state => ({
    isLoading: state.isLoading,
    isError: state.isLoading,
    authors: state.apiReducer.authors
  }),
	dispatch => bindActionCreators({
		getAuthors: getAuthors
	}, dispatch)
)(AuthorsHome)));
