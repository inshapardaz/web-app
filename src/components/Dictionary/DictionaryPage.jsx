import React from 'react';
import { connect } from 'react-redux';
import ApiService from '../../services/api';
import Page from '../Layout/Page.jsx';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import queryString from 'query-string'

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

    const values = queryString.parse(this.props.location.search);

    this.loadDictionary(params.id, values.page);
    this.loadWords(params.id, values.page);
  }

  componentWillReceiveProps(nextProps) {
    const {
      match: { params },
    } = nextProps;

    const values = queryString.parse(nextProps.location.search);

    this.loadDictionary(params.id, values.page);
    this.loadWords(params.id, values.page);
  }

  loadDictionary(id) {
    this.setState({
      isLoading: true,
      dictionaryId: id
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

  onPageChange = (page, pageSize) =>
  {
    this.props.history.push(`/dictionaries/${this.state.dictionaryId}?page=${page}`);
  }

  render() {
    const { isLoading, isError, isLoadingWords, dictionary, words } = this.state;

    if (!dictionary || !words)
      return null;
    return (
      <Page {...this.props} title={dictionary.name} isLoading={isLoading} isError={isError}>
        <Helmet title={dictionary.name} />
        <List
          size="large"
          bordered
          loading={isLoadingWords}
          pagination={{
            onChange: this.onPageChange.bind(this),
            hideOnSinglePage:true,
            defaultCurrent: words.currentPageIndex,
            pageSize:words.pageSize,
            total:words.totalCount,
          }}
          dataSource={words.data}
          renderItem={word => (
            <List.Item>
              <List.Item.Meta
                title={<Link to={`/dictionaries/${dictionary.id}/words/${word.id}`}> {word.title} - ({word.titleWithMovements})</Link>}
                description={`Grammatical Attributes:  ${word.attributes}, Language: ${word.language}`}
              />
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
