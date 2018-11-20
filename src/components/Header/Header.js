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
          <ul className="header__authView">
            <li>
              <a href="javascript:void(0)" onClick={this.onLogin.bind(this)} >داخل ہوں</a>
            </li>
          </ul>
      );
    }
    else
    {
      authView = (
        <div className="header__authView">
        <ul>
          <li>
            <h3>خوش آمدید, {user ? user.profile.name : "جناب"}!</h3>
          </li>
          <li><a href="javascript:void(0)" onClick={this.onLogout.bind(this)}>خروج</a></li>
          </ul>
        </div>);
    }

    return (
      <div className="header">
        <div className="header__logo">انشاپرداز</div>
        <div className="header__nav">
          <ul>
            <li><NavLink exact to="/">سرورق</NavLink></li>
            <li><NavLink to="/books">کُتب</NavLink></li>
            <li><NavLink to="/authors">ادیب</NavLink></li>
            <li><NavLink to="/categories">زمرہ‌جات</NavLink></li>
            <li><NavLink to="/about">ہمارے بارے میں</NavLink></li>
          </ul>
        </div>
        {authView}
    </div>);
  }
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
