import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAuthor } from '../../actions/api';

import Image from '../Image.jsx';
import AuthorBookList from './AuthorBookList.jsx';

class AuthorPage extends React.Component
{
  async componentWillMount() {
    const {
      match: { params },
    } = this.props

    this.setState({
      isLoading : true
    });

    try
    {
      var author = await this.props.getAuthor(params.id)
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
    const props = this.props

    if (props.isLoading)
    {
      return <div>Loading...</div>
    }

    if (props.isError)
    {
      return <div>Error loading author. Please retry.</div>
    }
    const author = props.author
    if (!author) {
      return null
    }

    return (<div>
        <h2>{author.name}</h2>
        <br />
          <Image source={author}/>
        <br/>
        <span>Published {author.bookCount} books</span>
        <AuthorBookList author={author} />
      </div>);
  }
}

export default connect(
  state => ({
    isLoading: state.isLoading,
    isError: state.isError,
    author: state.apiReducer.author,
  }),
  dispatch =>
    bindActionCreators(
      {
        getAuthor,
      },
      dispatch,
    ),
)(AuthorPage)
