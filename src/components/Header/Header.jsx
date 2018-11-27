import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { login, logout } from '../../actions/authentication';

import './style.scss';
import { Layout, Menu, Avatar, Icon } from 'antd';

const { Header } = Layout;
const SubMenu = Menu.SubMenu;

class AppHeader extends React.Component {
  onLogin() {
    this.props.login();
  }

  onLogout() {
    this.props.logout();
  }

  render() {
    const { user } = this.props;
    let authView;
    if (!user || user.expired) {
      authView = (
        <SubMenu title={<Avatar shape="square" size={32} icon="user" />} style={{ float: 'left' }}>
          <Menu.Item key="login" onClick={this.onLogin.bind(this)}><Icon type="login" /> داخل ہوں</Menu.Item>
        </SubMenu>
      );
    }
    else {
      authView = (
        <SubMenu title={<Avatar shape="square" size={32} icon="user" />} style={{ float: 'left' }}>
          <Menu.Item  key="username"><Icon type="user" /> {user.profile.name}</Menu.Item>
          <Menu.Item key="logout" onClick={this.onLogout.bind(this)}><Icon type="logout" /> خروج</Menu.Item>
        </SubMenu>
          );
      }

      return (
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
          <div className="logo" >
            <img src="resources/images/inshapardaz.png" alt="logo" style={{width:'104px'}}/>
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ 'lineHeight': '64px' }}>
            <Menu.Item key="1" style={{ float : 'right'}}><NavLink exact to="/">سرورق <Icon type="home" /></NavLink></Menu.Item>
            <Menu.Item key="2" style={{ float : 'right'}}><NavLink to="/books">کُتب <Icon type="read" /></NavLink></Menu.Item>
            <Menu.Item key="3" style={{ float : 'right'}}><NavLink to="/authors">ادیب <Icon type="team" /></NavLink></Menu.Item>
            <Menu.Item key="4" style={{ float : 'right'}}><NavLink to="/categories">زمرہ‌جات <Icon type="tags" /></NavLink></Menu.Item>
            <Menu.Item key="5" style={{ float : 'right'}}><NavLink to="/about">ہمارے بارے میں <Icon type="info-circle" /></NavLink></Menu.Item>
            {authView}
          </Menu>
      </Header>);
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
)(AppHeader);
