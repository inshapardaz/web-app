import React from 'react';
import { connect } from 'react-redux';
import ApiService from '../../services/api';
import { Link } from 'react-router-dom';
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
    if (this.props.entry) {
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
    else if (latestBooks) {
      if (latestBooks.length > 0) {
        return (
          <div className="cwt__block cwt__features">
            <h1 className="cwt__block-title">
              نئی کتابیں
                </h1>
            <div className="cwt__features__container">
              <div className="row">
                {latestBooks.slice(0, 6).map(b => (
                  <div className="col-lg-4 col-md-6" key={b.id}>
                    <div className="cwt__features__item">
                      <i className="cwt__features__icon lnr lnr-book"></i>
                      <span className="cwt__features__title">
                      <Link to={'/books/' + b.id} >{b.title}</Link>
                      </span>
                      <div className="cwt__features__descr">
                        {b.authorName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>)
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
