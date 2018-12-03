import React from 'react';
import { connect } from 'react-redux';
import ApiService from '../../services/api';
import Page from '../Layout/Page.jsx';
import {Link} from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { List } from 'antd';

class DictionaryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isError: false,
      isLoadingWords: true,
      isErrorLoadingWords: false,
      dictionary: null,
      words: null
    }
  }

  componentWillMount() {
    const {
      match: { params },
    } = this.props

    this.loadDictionary(params.id);
    this.loadWords(params.id);
  }

  componentWillReceiveProps(nextProps) {
    const {
      match: { params },
    } = nextProps
    this.loadDictionary(params.id);
    this.loadWords(params.id);
  }

  loadDictionary(id) {
    this.setState({
      isLoading: true
    });

    const api = new ApiService(this.props.user);
    api.getDictionary(id)
      .then(
        (result) => {
          this.setState({
            isLoading: false,
            dictionary: result
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

  loadWords(id, page = 1) {
    this.setState({
      isLoadingWords: true
    });

    const api = new ApiService(this.props.user);
    api.getWords(id, page)
      .then(
        (result) => {
          this.setState({
            isLoadingWords: false,
            words: result
          });
        },
        () => {
          this.setState({
            isLoadingWords: false,
            isErrorLoadingWords: true
          });
        }
      )
  }

  render() {
    const { isLoading, isError, isLoadingWords, dictionary, words } = this.state;

    if (!dictionary)
      return null;
    return (
      <Page {...this.props} title={dictionary.name} isLoading={isLoading} isError={isError}>
        <Helmet title={dictionary.name} />
        <List
          size="large"
          bordered
          loading={isLoadingWords}
          dataSource={words.data}
          renderItem={word => (
            <List.Item>
              <Link to={`/dictionaries/${dictionary.id}/words/${word.id}`}>
                {word.title}
              </Link>
            </List.Item>)
          }
        />
      </Page>);
  }
}

export default connect(
  state => ({
    user: state.oidc.user
  }), null)(DictionaryPage);
