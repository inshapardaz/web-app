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

        const { login, logout } = this.props;
        const { profile } = this.state;
        const isLoggedIn = AuthService.isLoggedIn();

        if (isLoggedIn) {
            const displayName = profile != null ? profile.nickname : "";

            return (
                <div className="dropdown d-inline-block ml-2">
                    <button type="button" className="btn btn-sm btn-dual" id="page-header-user-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <img className="rounded" src="assets/media/avatars/avatar10.jpg" alt="Header Avatar" style={{ width: "18px" }} />
                        <span className="d-none d-sm-inline-block ml-1"><FormattedMessage id="welcome.user" values={{ user: displayName }} /></span>
                        <i className="fa fa-fw fa-angle-down d-none d-sm-inline-block"></i>
                    </button>
                    <div className="dropdown-menu dropdown-menu-right p-0 border-0 font-size-sm" aria-labelledby="page-header-user-dropdown">
                        <div className="p-3 text-center bg-primary">
                            <img className="img-avatar img-avatar48 img-avatar-thumb" src="/assets/media/avatars/avatar10.jpg" alt="" />
                        </div>
                        <div className="p-2">
                            <a className="dropdown-item d-flex align-items-center justify-content-between" href="javascript:void(0)">
                                <FormattedMessage id="header.settings" />
                                <i className="si si-settings"></i>
                            </a>
                            <div role="separator" className="dropdown-divider"></div>
                            <a className="dropdown-item d-flex align-items-center justify-content-between" href="javascript:void(0)">
                                <FormattedMessage id="changePassword" />
                                <i className="si si-lock ml-1"></i>
                            </a>
                            <a className="dropdown-item d-flex align-items-center justify-content-between" onClick={logout} href="javascript:void(0)">
                                <FormattedMessage id="logout" />
                                <i className="si si-logout ml-1"></i>
                            </a>
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div className="dropdown d-inline-block ml-2">
                    <button type="button" className="btn btn-sm btn-dual" id="page-header-user-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <img className="rounded" src="assets/media/avatars/avatar10.jpg" alt="Header Avatar" style={{ width: "18px" }} />
                        <span className="d-none d-sm-inline-block ml-1"><FormattedMessage id="welcome.guest" /></span>
                        <i className="fa fa-fw fa-angle-down d-none d-sm-inline-block"></i>
                    </button>
                    <div className="dropdown-menu dropdown-menu-right p-0 border-0 font-size-sm" aria-labelledby="page-header-user-dropdown">
                        <div className="p-3 text-center bg-primary">
                            <img className="img-avatar img-avatar48 img-avatar-thumb" src="/assets/media/avatars/avatar10.jpg" alt="" />
                        </div>
                        <div className="p-2">
                            <a className="dropdown-item d-flex align-items-center justify-content-between" href="javascript:void(0)">
                                <FormattedMessage id="register" />
                                <i className="si si-settings"></i>
                            </a>
                            <div role="separator" className="dropdown-divider"></div>
                            <a className="dropdown-item d-flex align-items-center justify-content-between" href="javascript:void(0)">
                                <FormattedMessage id="forgetPassword" />
                                <i className="si si-lock ml-1"></i>
                            </a>
                            <a className="dropdown-item d-flex align-items-center justify-content-between" onClick={login} href="javascript:void(0)">
                                <FormattedMessage id="login" />
                                <i className="si si-logout ml-1"></i>
                            </a>
                        </div>
                    </div>
                </div>
            );
        }
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
