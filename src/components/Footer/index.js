import React, { Component } from 'react'
import { Dropdown } from 'react-bootstrap';
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
                    <Dropdown className="col-sm-6 order-sm-2 pull-right">
                        <Dropdown.Toggle size="sm" variant="outline-secondary" id="dropdown-basic">
                            <i className="fa fa-language ml-1 mr-1"/>
                            {selectedLanguage}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                        <Dropdown.Item onClick={() => this.chooseLanguage("en")}>English</Dropdown.Item>
                        <Dropdown.Item onClick={() => this.chooseLanguage("ur")}>Urdu</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <div className="col-sm-6 order-sm-1 py-1 text-center text-sm-left">
                        <a className="font-w600" href="/" target="_blank"><FormattedMessage id="app" /></a> &copy; <span data-toggle="year-copy"></span>
                    </div>
                </div>
            </div>
        </footer>
        );
    }
}