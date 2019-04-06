import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { login, logout } from '../../actions/authActions'
import { FormattedMessage } from 'react-intl';
import AuthService from '../../services/AuthService';

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

        var items = null;
        const { login, logout } = this.props;
        const { profile } = this.state;
        const isLoggedIn = AuthService.isLoggedIn();
        if (isLoggedIn) {
            const displayName = profile != null ? profile.nickname : "";
            items = (
                <div className="dropdown tg-themedropdown tg-currencydropdown">
                    <a href="javascript:void(0);" id="tg-currenty" className="tg-btnthemedropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                       <FormattedMessage id="welcome.user" values={{ user: displayName }} />
                    </a>
                    <ul className="dropdown-menu tg-themedropdownmenu" aria-labelledby="tg-currenty">
                        <li>
                            <a href="javascript:void(0);">
                                <i className="icon-cog" />
                                <FormattedMessage id="header.settings" />
                            </a>
                        </li>
                        <li>
                            <a href="javascript:void(0);">
                                <i className="icon-user-check" />
                                <FormattedMessage id="changePassword" />
                            </a>
                        </li>
                        <li>
                            <a href="javascript:void(0);" onClick={logout} >
                                <i className="icon-exit" />
                                <FormattedMessage id="logout" />
                            </a>
                        </li>
                    </ul>
                </div>
            );
        } else {
            items = (
                <div className="dropdown tg-themedropdown tg-currencydropdown">
                    <a href="javascript:void(0);" id="tg-currenty" className="tg-btnthemedropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <FormattedMessage id="welcome.guest"/>
                    </a>
                    <ul className="dropdown-menu tg-themedropdownmenu" aria-labelledby="tg-currenty">
                        <li>
                            <a href="javascript:void(0);">
                                <i className="icon-user-plus" />
                                <FormattedMessage id="register" />
                            </a>
                        </li>
                        <li>
                            <a href="javascript:void(0);">
                                <i className="icon-user-check" />
                                <FormattedMessage id="forgetPassword" />
                            </a>
                        </li>
                        <li>
                            <a href="javascript:void(0);" onClick={() => login()} >
                                <i className="icon-enter" />
                                <FormattedMessage id="login" />
                            </a>
                        </li>
                    </ul>
                </div>
            );
        }
        return items;
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
