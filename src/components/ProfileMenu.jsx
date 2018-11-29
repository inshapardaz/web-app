import React from 'react'
import { connect } from 'react-redux'
import { login, logout } from '../actions/authentication'
import { Menu, Dropdown, Avatar, Badge } from 'antd'
import { bindActionCreators } from 'redux';

class ProfileMenu extends React.Component {
  state = {
    count: 7,
  }

  render() {
    const { count } = this.state
    const { user, login, logout } = this.props;
    let menu;
    if (!user || user.expired) {
      menu = (
        <Menu selectable={false}>
          <Menu.Item>
            <a href="javascript: void(0);" onClick={login}>
              <i className="topbar__dropdownMenuIcon icmn-user-plus" /> Register
            </a>
          </Menu.Item>
          <Menu.Item>
            <a href="javascript: void(0);" onClick={login}>
              <i className="topbar__dropdownMenuIcon icmn-key" /> Forgot Password
            </a>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item>
            <a href="javascript: void(0);" onClick={login}>
              <i className="topbar__dropdownMenuIcon icmn-enter" /> Login
            </a>
          </Menu.Item>
        </Menu>
      );
    }
    else {
      menu = (
        <Menu selectable={false}>
          <Menu.Item>
            <div className="rfq__widget__system-status__item">
              <strong>Hello, {user.profile.name}</strong>
              <div>
                <strong>Role:</strong> {user.profile.name}
              </div>
            </div>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item>
            <a href="javascript: void(0);">
              <i className="topbar__dropdownMenuIcon icmn-user" /> Edit Profile
          </a>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item>
            <a href="javascript: void(0);" onClick={logout}>
              <i className="topbar__dropdownMenuIcon icmn-exit" /> Logout
          </a>
          </Menu.Item>
        </Menu>
      )
    }
    return (
      <div className="topbar__dropdown d-inline-block">
        <Dropdown
          overlay={menu}
          trigger={['click']}
          placement="bottomRight"
          onVisibleChange={this.addCount}
        >
          <a className="ant-dropdown-link" href="/">
            <Avatar className="topbar__avatar" shape="square" size="large" icon="user" />
          </a>
        </Dropdown>
      </div>
    )
  }
}

export default connect(
  state => ({
    user: state.oidc.user,
  }),
  dispatch => bindActionCreators({
    login,
    logout
  }, dispatch)
)(ProfileMenu)
