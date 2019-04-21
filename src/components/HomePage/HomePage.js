import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { login } from '../../actions/authActions'
import { FormattedMessage } from 'react-intl';
import LatestBooks from '../Books/LatestBooks';
import AuthService from '../../services/AuthService';

class HomePage extends React.Component {
    renderLoginLink = () => {
        const isLoggedIn = AuthService.isLoggedIn();
        const { login } = this.props;
        if (!isLoggedIn) {
            return (<span className="m-2 d-inline-block" data-toggle="appear" data-class="animated fadeInUp" data-timeout="600">
                <a className="btn btn-primary px-4 py-2" onClick={() => login() }>
                    <i className="fa fa-fw fa-key mr-1" /> <FormattedMessage id="login" />
                </a>
            </span>);
        }
        return null;
    }
    render() {


        return (
            <>
                <div className="bg-image" style={{ backgroundImage: "url('resources/img/main.jpg')" }}>
                    <div className="hero bg-black-75 overflow-hidden">
                        <div className="hero-inner">
                            <div className="content content-full text-center">
                                <div className="mb-5 invisible" data-toggle="appear" data-class="animated fadeInDown">
                                    <i className="fa fa-circle-notch fa-3x text-primary" />
                                </div>
                                <h1 className="display-4 font-w600 mb-3 text-white">
                                    {<FormattedMessage id="app" />}
                                </h1>
                                <h2 className="h3 font-w400 text-white-50 mb-5">
                                    <FormattedMessage id="slogan" />
                                </h2>
                                <span className="m-2 d-inline-block" data-toggle="appear" data-class="animated fadeInUp" data-timeout="600">
                                    <Link className="btn btn-success px-4 py-2" data-toggle="click-ripple" to="/books">
                                        <i className="fa fa-fw fa-book-reader mr-1" /> <FormattedMessage id="home.getStarted" />
                                    </Link>
                                </span>
                                {this.renderLoginLink()}
                            </div>
                        </div>
                        <div className="hero-meta">
                            <div className="js-appear-enabled animated fadeIn" data-toggle="appear" data-timeout="450">
                                <span className="d-inline-block animated slideInDown infinite">
                                    <i className="fa fa-angle-down text-white-50 fa-2x" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <LatestBooks />
            </>
        );
    }
}

export default connect(
    state => ({
        user: state.oidc.user,
    }),
    dispatch => bindActionCreators({
        login,
    }, dispatch)
)(HomePage)
