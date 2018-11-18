import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { login, logout } from '../actions/authentication';

class NavBar extends React.Component {
  onLogin() {
    this.props.login();
  }

  onLogout() {
    this.props.logout();
  }

  render() {
    const { user } = this.props;
    if (!user || user.expired)
    {
      return (<input type="button" value="Login" onClick={this.onLogin.bind(this)} />);
    }
    else
    {
      return (<div>
        <h3>Welcome, {user ? user.profile.name : "Mister Unknown"}!</h3>
        <input type="button" value="Logout" onClick={this.onLogout.bind(this)} />
      </div>);
    }
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
)(NavBar);
