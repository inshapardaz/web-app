import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { login, logout } from '../../actions/authActions'
import { Dropdown, Icon } from 'semantic-ui-react'
import {FormattedMessage} from 'react-intl';
import AuthService from '../../services/AuthService';
import { NavDropdown } from 'react-bootstrap';

class ProfileMenu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            profile : {
                nickname : ""
            }
        }
    }
    componentWillMount(){
        if (AuthService.isLoggedIn()){
            AuthService.getProfile((err, profile) => {
                this.setState({ profile });
              })
        }
    }
    render() {

        var items = null;
        const { login, logout } = this.props;
        const { profile } = this.state;
        const isLoggedIn = AuthService.isLoggedIn();
        if (isLoggedIn) {
            const displayName = profile != null ? profile.nickname : "";
            items = (
                <>
                    <NavDropdown.Item><FormattedMessage id="welcome.user" values={{user:displayName}} /></NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item><FormattedMessage id="profile.edit"/></NavDropdown.Item>
                    <NavDropdown.Item><FormattedMessage id="changePassword"/></NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={logout} ><FormattedMessage id="logout"/></NavDropdown.Item>
                </>
            );
        } else {
            items = (
                <>
                    <NavDropdown.Item> <FormattedMessage id="register"/></NavDropdown.Item>
                    <NavDropdown.Item> <FormattedMessage id="forgetPassword"/> </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={() => login() }  text={<FormattedMessage id="login"/> } ></NavDropdown.Item>
                </>
            );
        }
        return (
            <NavDropdown title={<Icon name='user' />} alignRight={true}>
                {items}
            </NavDropdown>
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
