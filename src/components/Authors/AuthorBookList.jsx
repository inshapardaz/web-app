import React from 'react';
import {connect} from 'react-redux';

import ApiService from '../../services/api';

import BookList from '../Books/BooksList.jsx';
import rel from '../../utils/rel';

class AuthorBookList extends React.Component
{
  constructor(props){
    super(props);
    this.state = {
      isError: false,
      isLoading: false,
      authorBooks: { data:[], pageSize: 0, currentPageIndex: 0, totalCount: 0}
    };
  }

  componentDidMount()
  {
    this.setState({
      isLoading : true
    });

    const api = new ApiService(this.props.user);
    api.getAuthorBooks(rel(this.props.author.links, 'books'))
    .then(
      (result) => {
        this.setState({
          isLoading : false,
          authorBooks: result
        });
      },
      (error) => {
        this.setState({
          isLoading : false,
          isError:true
        });
      }
    )
  }

  pageChange = async(link) =>
  {
    this.setState({
      isLoading : true
    });

    getAuthorBooks(link)
    .then(
      (result) => {
        this.setState({
          isLoading : false,
          authorBooks: result
        });
      },
      (error) => {
        this.setState({
          isLoading : false,
          isError:true
        });
      }
    )
  }

  render(){
    if (!this.state)
      return null;
    const { isError, isLoading, authorBooks } = this.state;
    if (isError)
    {
      return <h5>Unable to load books</h5>;
    }
    else if (isLoading || !authorBooks)
    {
      return <div>Loading...</div>;
    }
    return (<BookList books={authorBooks} />)
  }
}

export default connect(
  state => ({
    user: state.oidc.user
}), null)(AuthorBookList);
