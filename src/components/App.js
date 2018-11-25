/* eslint-disable import/no-named-as-default */
import { Route, Switch, withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AboutPage from "./AboutPage";
import HomePage from "./HomePage/HomePage.jsx";
import NotFoundPage from "./NotFoundPage";
import ErrorPage from "./ErrorPage";
import PropTypes from "prop-types";
import React from "react";
import { hot } from "react-hot-loader";

import Header from './Header/Header.jsx';
import CallbackPage from './Callback';
import SilentRefresh from "./silentRefresh";
import BooksHome from "./Books/BooksHome.jsx";
import AuthorsHome from "./Authors/AuthorsHome.jsx";

import { entry } from '../actions/api'

class App extends React.Component {
  async componentDidMount(){
    this.setState({
      isLoading : true
    });
    try
    {
      let entry = await this.props.entry();
    }
    catch (error)
    {
      console.log("ERROR" + error);
      this.props.history.push('/error');
    }

    this.setState({
      isLoading : false
    });
  }

  render() {
    if (this.props.isLoading)
    {
      return <div>Loading...</div>
    }

    return (
      <div>
        <Header />
        <div className="main">
          <Switch>
            <Route exact path="/callback" component={CallbackPage} />
            <Route exact path="/silent_renew" component={SilentRefresh} />
            <Route exact path="/books" component={BooksHome} />
            <Route exact path="/authors" component={AuthorsHome} />
            <Route exact path="/about" component={AboutPage} />
            <Route exact path="/error" component={ErrorPage} />
            <Route exact path="/" component={HomePage} />
            <Route component={NotFoundPage} />
          </Switch>
        </div>
      </div>
    );
  }
}

// App.propTypes = {
//   children: PropTypes.element
// };

//  export default hot(module)(App);

export default hot(module)(withRouter(connect(
  state => ({
    history: state.history,
    entry: state.entry,
    isLoading:  state.isLoading
  }),
	dispatch => bindActionCreators({
		entry: entry
	}, dispatch)
)(App)));
