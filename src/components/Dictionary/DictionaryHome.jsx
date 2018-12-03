import React from 'react';
import {connect} from 'react-redux';
import { Helmet } from 'react-helmet';
import Page from '../Layout/Page.jsx';
import ApiService from '../../services/api';
import rel from '../../utils/rel';

import Image from '../Image.jsx';

import { Link } from 'react-router-dom';
import { List, Card, Tag } from 'antd';

const { Meta } = Card;

class DictionaryHome extends React.Component
{
  constructor (props)
	{
		super(props);

		this.state = {
      isLoading : true,
      isError : false,
      dictionaries: null
		};
  }

  componentDidMount()
  {
    this.loadDictionaries(this.props);
  }

  componentWillReceiveProps(nextProps){
    this.loadDictionaries(nextProps);
  }

  loadDictionaries(props)
  {
    this.setState({
      isLoading : true
    });

    const api = new ApiService(this.props.user);
    api.get(rel(this.props.entry.links, 'dictionaries'))
    .then(
      (result) => {
        this.setState({
          isLoading : false,
          dictionaries: result
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

  onPageChange = (page) =>
  {
    this.props.history.push(`/dictionaries?page=${page}`);
  }

  render()
  {
    const {isLoading, isError, dictionaries } = this.state;

    if (!dictionaries)
      return null;
    return (
    <Page {...this.props} title="Dictionaries" isLoading={isLoading} isError={isError}>
      <Helmet title="Dictionaries" />
      <List
        itemLayout="vertical"
        size="large"
        dataSource={dictionaries.items}
        renderItem={dictionary => (
          <List.Item>
            <Meta
              title={<Link to={'/dictionaries/' + dictionary.id} >{dictionary.name}</Link>}/>
          </List.Item>
        )}
      />
    </Page>);
  }
}

export default connect(
  state => ({
    user: state.oidc.user,
    entry: state.apiReducer.entry
}), null)(DictionaryHome);
