import React, { Component } from 'react'
import { Navbar, NavDropdown } from 'react-bootstrap';
import LocaleService from '../../services/LocaleService';

export default class Footer extends Component {
    state = {
        locale : LocaleService.getCurrentLanguage()
    }

    chooseLanguage(language){
        LocaleService.setCurrentLanguage(language);
        location.reload();
    }
    
    render() {
        const selectedLanguage = this.state.locale == "ur" ? "Urdu" : "English";
        return (<Navbar fixed="bottom" bg="dark" variant="dark">
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
