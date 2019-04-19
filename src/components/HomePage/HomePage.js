import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Segment, Header, Icon } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl';
import LatestBooks from '../Books/LatestBooks';


class HomePage extends React.Component {
    render() {
        const mobile = false;
        return (
            <>
            <div className="bg-image" style={{ backgroundImage: "url('resources/img/main.jpg')" }}>
                <div className="hero bg-black-75 overflow-hidden">
                    <div className="hero-inner">
                        <div className="content content-full text-center">
                            <div className="mb-5 invisible" data-toggle="appear" data-class="animated fadeInDown">
                                <i className="fa fa-circle-notch fa-3x text-primary"></i>
                            </div>
                            <h1 className="display-4 font-w600 mb-3 text-white">
                                {<FormattedMessage id="app" />}
                            </h1>
                            <h2 className="h3 font-w400 text-white-50 mb-5">
                                <FormattedMessage id="slogan" />
                            </h2>
                            <span className="m-2 d-inline-block" data-toggle="appear" data-class="animated fadeInUp" data-timeout="600">
                                <a className="btn btn-success px-4 py-2" data-toggle="click-ripple" href="https://1.envato.market/xWy">
                                    <i className="fa fa-fw fa-book-reader mr-1"></i> <FormattedMessage id="home.getStarted" />
                                    </a>
                            </span>
                            <span className="m-2 d-inline-block" data-toggle="appear" data-class="animated fadeInUp" data-timeout="600">
                                <a className="btn btn-primary px-4 py-2" data-toggle="click-ripple" href="be_pages_dashboard.html">
                                    <i className="fa fa-fw fa-key mr-1"></i> <FormattedMessage id="login" />
                                    </a>
                            </span>
                        </div>
                    </div>
                    <div className="hero-meta">
                        <div className="js-appear-enabled animated fadeIn" data-toggle="appear" data-timeout="450">
                            <span className="d-inline-block animated slideInDown infinite">
                                <i className="fa fa-angle-down text-white-50 fa-2x"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <LatestBooks />
            </>
        );

        return (
            <>
                <div id="tg-homeslider" className="tg-homeslider tg-homeslidervthree tg-haslayout">
                    <Segment inverted
                        textAlign='center'
                        style={{
                            minHeight: 700,
                            padding: '1em 0em',
                            background: 'url(resources/img/main.jpg) no-repeat center center',
                            backgroundSize: 'cover'
                        }}
                        vertical>
                        <Header
                            as='h1'
                            content={<FormattedMessage id="app" />}
                            inverted
                            style={{
                                fontSize: mobile ? '2em' : '4em',
                                fontWeight: 'normal',
                                marginBottom: 0,
                                marginTop: mobile ? '1.5em' : '3em',
                            }}
                        />
                        <Header
                            as='h2'
                            content={<FormattedMessage id="slogan" />}
                            inverted
                            style={{
                                fontSize: mobile ? '1.5em' : '1.7em',
                                fontWeight: 'normal',
                                marginTop: mobile ? '0.5em' : '1.5em',
                            }}
                        />
                        <Button primary size='huge' as={Link} to="/books">
                            <FormattedMessage id="home.getStarted" />
                            <Icon name='right arrow' />
                        </Button>
                    </Segment>
                </div>
                <main id="tg-main" className="tg-main tg-haslayout">
                    <LatestBooks />
                </ main>
            </>
        );
    }
}

export default HomePage;