import React from 'react';
import {connect} from 'react-redux';
import ApiService from '../../services/api';
import rel from '../../utils/rel';

class FavoriteBooks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isError: false,
      favoriteBooks: null
    };
  }

  componentDidMount() {
    if (this.props.entry){
      this.loadLatestBooks(rel(this.props.entry.links, 'favorites'));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.entry) {
      this.loadLatestBooks(rel(nextProps.entry.links, 'favorites'));
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

    if (isLoading) {
      return <div>Loading...</div>;
    }
    else if (isError) {
      return <div>Error loading favorites</div>;
    }
    else if (favoriteBooks){
      if (favoriteBooks.length > 0) {
        <div className="cwt__block cwt__features">
            <h1 className="cwt__block-title">
              پسندیدہ کتابیں
                </h1>
            <div className="cwt__features__container">
              <div className="row">
                {favoriteBooks.slice(0, 6).map(b => (
                  <div className="col-lg-4 col-md-6" key={b.id}>
                    <div className="cwt__features__item">
                      <i className="cwt__features__icon lnr lnr-book"></i>
                      <span className="cwt__features__title">
                        {b.title}
                      </span>
                      <div className="cwt__features__descr">
                        {b.authorName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
      }
      else {
        return <div>No favorites found.</div>
      }
    }
    return null;
  }
}

export default connect(
  state => ({
    user: state.oidc.user,
    entry: state.apiReducer.entry
}), null)(FavoriteBooks);
