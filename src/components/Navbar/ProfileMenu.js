import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { login, logout } from '../../actions/authActions'
import { Dropdown, Icon } from 'semantic-ui-react'
import {FormattedMessage} from 'react-intl';

class ProfileMenu extends React.Component {
    render() {

        var items = null;
        const { user, login, logout } = this.props;
        if (!user || user.expired) {
            items = (
                <React.Fragment>
                    <Dropdown.Item> <FormattedMessage id="register"/></Dropdown.Item>
                    <Dropdown.Item> <FormattedMessage id="forgetPassword"/> </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => login() }  text={<FormattedMessage id="login"/> } ></Dropdown.Item>
                </React.Fragment>
            );
        } else {
            items = (
                <React.Fragment>
                    <Dropdown.Item><FormattedMessage id="welcome.user" values={{user:user.profile.name }} /></Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item><FormattedMessage id="profile.edit"/></Dropdown.Item>
                    <Dropdown.Item><FormattedMessage id="changePassword"/></Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={logout} text={<FormattedMessage id="logout"/> }></Dropdown.Item>
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
