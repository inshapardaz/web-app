import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { login, logout } from '../../actions/authActions'
import { Dropdown, Icon } from 'semantic-ui-react'
import {FormattedMessage} from 'react-intl';
import AuthService from '../../services/AuthService';

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
            items = (
                <React.Fragment>
                    <Dropdown.Item><FormattedMessage id="welcome.user" values={{user:profile.nickname}} /></Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item><FormattedMessage id="profile.edit"/></Dropdown.Item>
                    <Dropdown.Item><FormattedMessage id="changePassword"/></Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={logout} text={<FormattedMessage id="logout"/> }></Dropdown.Item>
                </React.Fragment>
            );
        } else {
            items = (
                <React.Fragment>
                    <Dropdown.Item> <FormattedMessage id="register"/></Dropdown.Item>
                    <Dropdown.Item> <FormattedMessage id="forgetPassword"/> </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => login() }  text={<FormattedMessage id="login"/> } ></Dropdown.Item>
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
