/* eslint-disable import/no-named-as-default */
import { Route, Switch } from "react-router-dom";

import AboutPage from "./AboutPage";
import FuelSavingsPage from "./containers/FuelSavingsPage";
import HomePage from "./HomePage";
import NotFoundPage from "./NotFoundPage";
import PropTypes from "prop-types";
import React from "react";
import { hot } from "react-hot-loader";

import Header from './Header/Header';
import CallbackPage from './Callback';

class App extends React.Component {
  render() {
    const activeStyle = { color: 'blue' };
    return (
      <div>
        <Header />
        <div className="main">
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/callback" component={CallbackPage} />
            <Route path="/fuel-savings" component={FuelSavingsPage} />
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
