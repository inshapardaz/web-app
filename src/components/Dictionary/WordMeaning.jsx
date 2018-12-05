import React from 'react';
import { connect } from 'react-redux';
import ApiService from '../../services/api';

import { Icon, Spin  } from 'antd';
import './style.scss';

class WordMeaning extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isError: false,
      open: false,
      meanings: null,
      translations: null
    }
  }

  toggle() {
    this.setState(prevState => ({
      open: !prevState.open
    }));

    if (!this.state.open && this.state.meanings == null){
      this.loadMeanings()
      this.loadTranslations()
    }
  }

  loadMeanings(){
    this.setState({
      isLoading: true
    });

    const api = new ApiService(this.props.user);
    api.getWordMeaning(this.props.dictionaryId, this.props.wordId)
      .then(
        (result) => {
          this.setState({
            isLoading: false,
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

  loadTranslations()
  {
    this.setState({
      isLoading: true
    });

    const api = new ApiService(this.props.user);
    api.getWordTranslations(this.props.dictionaryId, this.props.wordId)
      .then(
        (result) => {
          this.setState({
            isLoading: false,
            translations: result
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

  render(){
    return (
    <div>
      <span style={{float:'left'}} onClick={this.toggle.bind(this)}>
        <Icon type={this.state.open ? "up-circle" : "down-circle"} />
      </span>
      <div  className={"collapse" + (this.state.open ? ' in' : '')}>
        { this.state.isLoading && <Spin />}
        { this.state.meanings != null && <ul>{this.state.meanings.map(m =>
          <li key={m.id}>
            <h6>{m.value}</h6>
            <span>{m.example}</span>
          </li> )}</ul>}

           { this.state.translations != null && <ul>{this.state.translations.map(m =>
          <li key={m.id}>
            <h6>{m.value}</h6>
            <span>{m.example}</span>
          </li> )}</ul>}
      </div>
    </div>);
  }
}


export default connect(
  (state, props) => ({
    user: state.oidc.user,
    dictionaryId: props.dictionaryId,
    wordId: props.wordId
  }), null)(WordMeaning);
