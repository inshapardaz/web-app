import React, { Component } from 'react'
import { Navbar, NavDropdown } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import LocaleService from '../../services/LocaleService';

export default class Footer extends Component {
    state = {
        locale: LocaleService.getCurrentLanguage()
    }

    chooseLanguage(language) {
        LocaleService.setCurrentLanguage(language);
        location.reload();
    }

    render() {
        const selectedLanguage = this.state.locale == "ur" ? "Urdu" : "English";

        return (<footer id="page-footer" className="bg-body-light">
        <div className="content py-3">
            <div className="row font-size-sm">
                <NavDropdown title={selectedLanguage} drop='up' className="col-sm-6 order-sm-2 py-1 text-sm-right">
                    <NavDropdown.Item onClick={() => this.chooseLanguage("en")}>English</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => this.chooseLanguage("ur")}>Urdu</NavDropdown.Item>
                </NavDropdown>
                <div className="col-sm-6 order-sm-1 py-1 text-center text-sm-left">
                    <a className="font-w600" href="/" target="_blank"><FormattedMessage id="app"/></a> &copy; <span data-toggle="year-copy"></span>
                </div>
            </div>
        </div>
    </footer>
    );
        return (<footer id="tg-footer" className="tg-footer tg-haslayout">
            <div className="tg-footerbar">
                <a id="tg-btnbacktotop" className="tg-btnbacktotop" href="javascript:void(0);"><i className="icon-chevron-up"></i></a>
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                           <span className="tg-copyright">2017 All Rights Reserved By &copy; Book Library</span>
						</div>
                        </div>
                    </div>
                </div>
                </footer>);
        return (<Navbar sticky="bottom" bg="dark" variant="dark">
                <Navbar.Text>
                    &copy; Inshapardaz.
                </Navbar.Text>

                <NavDropdown title={selectedLanguage} drop='up'>
                    <NavDropdown.Item onClick={() => this.chooseLanguage("en")}>English</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => this.chooseLanguage("ur")}>Urdu</NavDropdown.Item>
                </NavDropdown>
            </Navbar>);
        }
    }
