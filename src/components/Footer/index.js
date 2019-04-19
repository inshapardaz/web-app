import React, { Component } from 'react'
import { Navbar, NavDropdown } from 'react-bootstrap';
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
                <div className="col-sm-6 order-sm-2 py-1 text-center text-sm-right">
                    Crafted with <i className="fa fa-heart text-danger"></i> by <a className="font-w600" href="https://1.envato.market/ydb" target="_blank">pixelcave</a>
                </div>
                <div className="col-sm-6 order-sm-1 py-1 text-center text-sm-left">
                    <a className="font-w600" href="https://1.envato.market/xWy" target="_blank">OneUI 4.2</a> &copy; <span data-toggle="year-copy"></span>
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
