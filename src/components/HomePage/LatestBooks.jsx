import React from 'react';
import {connect} from 'react-redux';
import ApiService from '../../services/api';
import BookBadge from './BookBadge.jsx';

class LatestBooks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isError: false,
      latestBooks: []
    };
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    });

    const api = new ApiService(this.props.user);

    api.getLatestBooks()
      .then(
        (result) => {
          this.setState({
            isLoading: false,
            latestBooks: result
          });
        },
        () => {
          this.setState({
            isLoading: false,
            isError: true
          });
        }
      );

    this.setState({
      isLoading: true
    });
  }

  render() {
    const { isLoading, isError, latestBooks } = this.state;

    if (isLoading || !latestBooks) {
      return <div>Loading...</div>
    }
    else if (isError) {
      return <div>Error loading latest books</div>;
    }
    else {
      if (latestBooks.length > 0) {
        var items = latestBooks.map(item => <BookBadge key={item.id} book={item} />);
        return <ul>{items}</ul>
      }
      else {
        return <div>No Books found.</div>
      }
    }
  }
}

export default connect(
  state => ({
    user: state.oidc.user
}), null)(LatestBooks)
