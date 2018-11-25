import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getBook } from '../../actions/api';

import rel from '../../utils/rel';

class BookPage extends React.Component
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
      var book = await this.props.getBook(params.id)
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
      return <div>Error loading book. Please retry.</div>
    }
    const book = props.book
    if (!book) {
      return null
    }

    const imageUrl = rel(book.links, 'image');

    return (<div>
        <h2>{book.title}</h2>
        <br/>
        <img src={imageUrl} />
        <br />
        <div>{book.description}</div>
      </div>);
  }
}

export default connect(
  state => ({
    isLoading: state.isLoading,
    isError: state.isError,
    book: state.apiReducer.book,
  }),
  dispatch =>
    bindActionCreators(
      {
        getBook,
      },
      dispatch,
    ),
)(BookPage)
