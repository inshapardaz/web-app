import React from 'react';
import { connect } from 'react-redux';
import ApiService from '../../services/api';

import { Spin, Tag, Icon, Table } from 'antd';
import rel from '../../utils/rel';
import './style.scss';

class WordTranslations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isError: false,
      hasLoaded: false,
      translations: null
    }
  }

  componentDidMount() {
    this.loadTranslations();
  }

  loadTranslations() {
    console.log("Loading translations");
    this.setState({
      isLoading: true
    });

    const api = new ApiService(this.props.user);
    api.get(rel(this.props.word.links, 'translations'))
      .then(
        (result) => {
          this.setState({
            isLoading: false,
            hasLoaded: true,
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

  renderIcon(translation)
  {
    if (translation.isTranspiling){
      return (<Icon type="swap" tooltip="transile" />);
    }

    return (<Icon type="swap-right" tooltip="translation" />);
  }
  render() {
    const {isLoading,translations } = this.state;

    if (translations && translations.length < 1)
    {
      return <div className="empty-message">تراجم موجود نہیں</div>;
    }

    return (
      <div>
        {isLoading && <Spin />}
        {translations != null && (
          <div>
            {translations.map(m =>
              <div key={m.id}>
                <h6>{this.renderIcon(m)} {m.value} <Tag>{m.language}</Tag> <small></small></h6>
              </div>)}
          </div>)}
      </div>);
  }
}


export default connect(
  (state, props) => ({
    user: state.oidc.user,
    word: props.word
  }), null)(WordTranslations);
