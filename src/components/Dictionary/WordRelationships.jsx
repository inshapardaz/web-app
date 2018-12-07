import React from 'react';
import { connect } from 'react-redux';
import ApiService from '../../services/api';

import { Spin, Tag } from 'antd';
import rel from '../../utils/rel';
import './style.scss';

class WordRelationships extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isError: false,
      relationships: null
    }
  }

  componentDidMount() {
    this.loadRelationships();
  }

  loadRelationships() {
    console.log("Loading Relationships");
    this.setState({
      isLoading: true
    });

    const api = new ApiService(this.props.user);
    api.get(rel(this.props.word.links, 'relationships'))
      .then(
        (result) => {
          this.setState({
            isLoading: false,
            relationships: result
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
    const {isLoading,relationships } = this.state;

    if (relationships && relationships.length < 1)
    {
      return <div className="empty-message">روابط موجود نہیں</div>;
    }

    return (
      <div>
        {isLoading && <Spin />}
        {relationships != null && (
          <div>
            {relationships.map(m =>
              <div key={m.id}>
                <h6>{m.relatedWord} <Tag>{m.relationType}</Tag></h6>
              </div>)
            }
          </div>)}
      </div>);
  }
}


export default connect(
  (state, props) => ({
    user: state.oidc.user,
    word: props.word
  }), null)(WordRelationships);
