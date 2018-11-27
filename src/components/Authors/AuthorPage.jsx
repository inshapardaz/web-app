import React from 'react';

import Image from '../Image.jsx';
import AuthorBookList from './AuthorBookList.jsx';

import {getAuthor} from '../../utils/fetchApi';

class AuthorPage extends React.Component
{
  componentWillMount() {
    const {
      match: { params },
    } = this.props

    this.setState({
      isLoading : true
    });

    getAuthor(params.id)
    .then(
      (result) => {
        this.setState({
          isLoading : false,
          author: result
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
    const { isError, isLoading, author } = this.state;

    if (isLoading)
    {
      return <div>Loading...</div>
    }

    if (isError)
    {
      return <div>Error loading author. Please retry.</div>
    }

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

export default AuthorPage;
