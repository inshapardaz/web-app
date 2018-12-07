import React from 'react';
import { connect } from 'react-redux';
import ApiService from '../../services/api';

import { Spin } from 'antd';
import rel from '../../utils/rel';
import './style.scss';

class WordMeaning extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isError: false,
      hasLoaded: false,
      meanings: null,
    }
  }

  componentDidMount() {
    this.loadMeanings();
  }

  loadMeanings() {
    console.log("Loading meaning");

    this.setState({
      isLoading: true
    });

    const api = new ApiService(this.props.user);
    api.get(rel(this.props.word.links, 'meanings'))
      .then(
        (result) => {
          this.setState({
            isLoading: false,
            hasLoaded: true,
            meanings: result
          });
        },
        () => {
          this.setState({
            isLoading: false,
            isError: true
          });
        }
      )
  }

  render() {
    const { isLoading, meanings } = this.state;

    if (meanings && meanings.length < 1)
    {
      return <div className="empty-message">معانی موجود نہیں</div>;
    }
    return (
      <div>
        { isLoading && <Spin />}
        { meanings != null && <ul>{meanings.map(m =>
          <li key={m.id}>
            <h6>{m.value}</h6>
            <span>{m.example}</span>
          </li>)}</ul>}
      </div>);
  }
}


export default connect(
  (state, props) => ({
    user: state.oidc.user,
    word: props.word
  }), null)(WordMeaning);