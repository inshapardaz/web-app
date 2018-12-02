import React from 'react';
import {connect} from 'react-redux';
import ApiService from '../../services/api';

class FavoriteBooks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isError: false,
      favoriteBooks: []
    };
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    });

    const api = new ApiService(this.props.user);

    api.getFavoriteBooks()
      .then(
        (result) => {
          this.setState({
            isLoading: false,
            favoriteBooks: result
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
    const { isLoading, isError, favoriteBooks } = this.state;

    if (isLoading || !favoriteBooks) {
      return <div>Loading...</div>;
    }
    else if (isError) {
      return <div>Error loading favorites</div>;
    }
    else {
      if (favoriteBooks.length > 0) {
        var items = favoriteBooks.map(item => <li key={item.id}>{item.name}</li>);
        return <ul>{items}</ul>
      }
      else {
        return <div>No favorites found.</div>
      }
    }
  }
}

export default connect(
  state => ({
    user: state.oidc.user
}), null)(FavoriteBooks);
