import React from 'react';
import { connect } from 'react-redux';
import ApiService from '../../services/api';
import BookCell from '../Books/BookCell.jsx';
import { Carousel } from 'antd';
import rel from '../../utils/rel';

class LatestBooks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isError: false,
      latestBooks: null
    };
  }

  componentDidMount() {
    if (this.props.entry){
      this.loadLatestBooks(rel(this.props.entry.links, 'latest'));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.entry) {
      this.loadLatestBooks(rel(nextProps.entry.links, 'latest'));
    }
  }

  loadLatestBooks(link) {
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

    if (isLoading) {
      return <div>Loading...</div>
    }
    else if (isError) {
      return <div>Error loading latest books</div>;
    }
    else if (latestBooks){
      if (latestBooks.length > 0) {
        var items = latestBooks.map(item => <BookCell key={item.id} book={item} />);
        return <Carousel autoplay>{items}</Carousel>
      }
      else {
        return <div>No Books found.</div>
      }
    }
    return null;
  }
}

export default connect(
  state => ({
    user: state.oidc.user,
    entry: state.apiReducer.entry
  }), null)(LatestBooks)
