import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { login, logout } from '../../actions/authActions'
import { Dropdown, Icon } from 'semantic-ui-react'
import userManager from '../../services/userManager';

class ProfileMenu extends React.Component {
    render() {

        var items = null;
        const { user, login, logout } = this.props;

        if (!user || user.expired) {
            items = (
                <React.Fragment>
                    <Dropdown.Item>Register</Dropdown.Item>
                    <Dropdown.Item>Forgot Password</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => login() }  text="Login" ></Dropdown.Item>
                </React.Fragment>
            );
        } else {
            items = (
                <React.Fragment>
                    <Dropdown.Item>Edit Profile</Dropdown.Item>
                    <Dropdown.Item>Change Password</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={logout} text="Logout"></Dropdown.Item>
                </React.Fragment>
            );
        }
        return (
            <Dropdown item icon='user' simple>
                <Dropdown.Menu>
                    {items}
                </Dropdown.Menu>
            </Dropdown>
        );
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
