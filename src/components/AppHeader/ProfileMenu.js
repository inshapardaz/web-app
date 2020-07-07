import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { login, logout } from '../../actions/authActions'
import { FormattedMessage } from 'react-intl';
import AuthService from '../../services/AuthService';
import { Menu, Dropdown, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const Styles = () => {
    return (<style>{`
    .dropdown {
        padding-right: 15px;
        position: relative;
        cursor: pointer;
    }
    .dropdown::after {
        color: #d2d9e5;
        position: absolute;
        top: 50%;
        right: 0;
        margin-top: -2px;
        display: inline-block;
        width: 0;
        height: 0;
        margin-left: 0.255em;
        vertical-align: 0.255em;
        content: '';
        border-top: 0.3em solid;
        border-right: 0.3em solid transparent;
        border-bottom: 0;
        border-left: 0.3em solid transparent;
        transition: all 0.2s ease-in-out;
    }  
    .dropdown:hover {
        color: #08f;
    } 
    .dropdown:hover::after {
        color: #b8beca;
    }
      
    .avatar {
        background-color: #e4e9f0;
    }

    .icon {
        margin-right: rem(6);
        color: d2d9e5;
        transition: all 0.2s ease-in-out;
    }
    
    .menuIcon {
        margin-right: rem(5);
    }
    `}</style>);
}
class ProfileMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: {
                nickname: ""
            }
        }
    }
    componentWillMount() {
        if (AuthService.isLoggedIn()) {
            AuthService.getProfile((err, profile) => {
                this.setState({ profile });
            })
        }
    }
    render() {

        const { login, logout } = this.props;
        const { profile } = this.state;
        const isLoggedIn = AuthService.isLoggedIn();

        const displayName = isLoggedIn && profile ? profile.nickname : "";

        const loginAction = isLoggedIn ?
            (<Menu.Item>
                <a href="javascript: void(0);" onClick={logout}>
                    <i className="fa fa-sign-out-alt menuIcon mr-2" />
                    <FormattedMessage id="logout" />
                </a>
            </Menu.Item>)
            :
            (<Menu.Item>
                <a href="javascript: void(0);" onClick={login}>
                <i className="fa fa-sign-in-alt menuIcon mr-2" />
                    <FormattedMessage id="login" />
                </a>
            </Menu.Item>);

        const menu = (
            <Menu selectable={false}>
                <Menu.Item>
                    <strong>
                        <FormattedMessage id="welcome.user" values={{ user: displayName }} />
                    </strong>
                </Menu.Item>
                <Menu.Divider />
                {loginAction}
            </Menu>
        )
        const avatar = profile.picture ? 
            (<Avatar className="avatar" shape="square" size="large" src={profile.picture} />) : 
            (<Avatar className="avatar" shape="square" size="large" icon={<UserOutlined />} />)

        return (
            <>
                <Styles />
                <Dropdown overlay={menu} trigger={['click']} onVisibleChange={this.addCount}>
                    <div className="dropdown">
                        {avatar}
                    </div>
                </Dropdown>
            </>
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
