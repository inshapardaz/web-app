/* eslint-disable import/no-named-as-default */
import { Route, Switch } from "react-router-dom";

import AboutPage from "./AboutPage";
import HomePage from "./HomePage";
import NotFoundPage from "./NotFoundPage";
import PropTypes from "prop-types";
import React from "react";
import { hot } from "react-hot-loader";

import Header from './Header/Header';
import CallbackPage from './Callback';
import SilentRefresh from "./silentRefresh";

class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <div className="main">
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/callback" component={CallbackPage} />
            <Route exact path="/silent_renew" component={SilentRefresh} />
            <Route path="/about" component={AboutPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element
};

export default hot(module)(App);
