import React from 'react';
import {connect} from 'react-redux';
import ApiService from '../../services/api';
import rel from '../../utils/rel';

class RecentBooks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isError: false,
      recentBooks: null
    };
  }

  componentDidMount() {
    if (this.props.entry){
      this.loadRecentBooks(rel(this.props.entry.links, 'recents'));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.entry) {
      this.loadRecentBooks(rel(nextProps.entry.links, 'recents'));
    }
  }

  loadRecentBooks(link) {
    if (!link)
      return;
    this.setState({
      isLoading: true
    });

    const api = new ApiService(this.props.user);
    api.get(link)
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

    if (isLoading) {
      return <div>Loading...</div>
    }
    else if (isError) {
      return <div>Error loading recent books</div>;
    }
    else if (recentBooks){
      if (recentBooks.length > 0) {
        var items = recentBooks.map(item => <li key={item.id}>{item.name}</li>);
        return <ul>{items}</ul>
      }
      else {
        return <div>No recently read book. Why not start reading some books.</div>
      }
    }
    return null;
  }
}

export default connect(
  state => ({
    user: state.oidc.user,
    entry: state.apiReducer.entry
}), null)(RecentBooks);
