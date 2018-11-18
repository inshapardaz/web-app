import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { login, logout } from '../../actions/authentication';

import './style.scss';

class Header extends React.Component {
  onLogin() {
    this.props.login();
  }

  onLogout() {
    this.props.logout();
  }

  render() {
    const { user } = this.props;
    let authView;
    if (!user || user.expired)
    {
      authView = (
          <div className="header__authView">
            <input type="button" value="Login" onClick={this.onLogin.bind(this)} />
          </div>
      );
    }
    else
    {
      authView = (
        <div className="header__authView">
          <h3>Welcome, {user ? user.profile.name : "Mister Unknown"}!</h3>
          <input type="button" value="Logout" onClick={this.onLogout.bind(this)} />);
        </div>);
    }

    return (
      <div className="header">
        <div className="header__logo">انشاپرداز</div>
        <div className="header__nav">
          <ul>
            <li><NavLink exact to="/">Home</NavLink></li>
            <li><NavLink to="/fuel-savings">Demo App</NavLink></li>
            <li><NavLink to="/about">About</NavLink></li>
          </ul>
        </div>
        {authView}
    </div>);
  };
}

export default connect(
  state => ({
    user: state.oidc.user,
  }),
  dispatch => bindActionCreators({
    login,
    logout
  },
    dispatch)
)(Header);
