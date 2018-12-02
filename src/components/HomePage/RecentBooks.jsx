import React from 'react';
import {connect} from 'react-redux';
import ApiService from '../../services/api';

class RecentBooks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isError: false,
      recentBooks: []
    };
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    });

    const api = new ApiService(this.props.user);
    api.getRecentBooks()
      .then(
        (result) => {
          this.setState({
            isLoading: false,
            recentBooks: result
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
    const { isLoading, isError, recentBooks } = this.state;

    if (isLoading || !recentBooks) {
      return <div>Loading...</div>
    }
    else if (isError) {
      return <div>Error loading recent books</div>;
    }
    else {
      if (recentBooks.length > 0) {
        var items = recentBooks.map(item => <li key={item.id}>{item.name}</li>);
        return <ul>{items}</ul>
      }
      else {
        return <div>No recently read book. Why not start reading some books.</div>
      }
    }
  }
}

export default connect(
  state => ({
    user: state.oidc.user
}), null)(RecentBooks);
