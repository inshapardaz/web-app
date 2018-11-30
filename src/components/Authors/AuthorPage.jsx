import React from 'react';

import {Button, Tabs } from 'antd';
import AuthorBookList from './AuthorBookList.jsx';

import { getAuthor } from '../../utils/fetchApi';
import Page from '../Layout/Page.jsx';
import './style.scss'
import rel from '../../utils/rel';
import Avatar from '../Avatar/Avatar.jsx'

const TabPane = Tabs.TabPane

class AuthorPage extends React.Component {
  componentWillMount() {
    const {
      match: { params },
    } = this.props

    this.loadAuthor(params.id);
  }

  componentWillReceiveProps(nextProps){
    const {
      match: { params },
    } = nextProps
    this.loadAuthor(params.id);
  }

  loadAuthor(id)
  {
    this.setState({
      isLoading: true
    });

    getAuthor(id)
      .then(
        (result) => {
          this.setState({
            isLoading: false,
            author: result
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
    if (!this.state)
      return null;
    const { isError, isLoading, author } = this.state;

    if (isLoading) {
      return <div>Loading...</div>
    }

    if (isError) {
      return <div>Error loading author. Please retry.</div>
    }

    if (!author) {
      return null
    }

    return (<Page>
      <div className="profile">
        <div className="row">
          <div className="col-xl-4">
            <div className="card profile__header" style={{ backgroundImage: 'url(/resources/images/bkg_3.jpeg)' }}>
              <div className="profile__header-card">
                <div className="card-body text-center">
                  <Avatar src={rel(author.links, 'image')} size="110" border="true" borderColor="white" />
                  <br />
                  <br />
                  <Button.Group size="default">
                    <Button style={{ width: 150 }}>Add to Favorite</Button>
                  </Button.Group>
                </div>
              </div>
            </div>
            <div className="card profile__social-info">
              <div className="profile__social-name">
                <h2>
                  <span className="text-black mr-2">
                    <strong>{author.name}</strong>
                  </span>
                </h2>
              </div>
              <div className="profile__social-counts">
                <div className="text-center mr-3">
                  <h2>{author.bookCount}</h2>
                  <p className="mb-0">Book</p>
                </div>
                <div className="text-center">
                  <h2>{0}</h2>
                  <p className="mb-0">Writings</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-8">
            <div className="card">
              <div className="card-body">
                <Tabs defaultActiveKey="1">
                  <TabPane
                    tab={
                      <span>
                        <i className="icmn-books" /> Books
                      </span>
                    }
                    key="1"
                  >
                     <AuthorBookList author={author} />
                  </TabPane>
                  <TabPane
                    tab={
                      <span>
                        <i className="icmn-pencil" /> Writings
                      </span>
                    }
                    key="2"
                  >
                  </TabPane>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>);
  }
}

export default AuthorPage;
