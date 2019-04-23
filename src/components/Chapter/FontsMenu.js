import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class FontsMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
            font: 'Mehr-Nastaleeq',
            subMenuOpen: false
        };

        this.changeFont = this.changeFont.bind(this);
    }
    

    componentWillMount() {
        var font = localStorage.getItem('reader.font');
        if (font) {
            this.setState({
                font: font
            });

            this.props.onFontChanged(font);
        }
    }

    changeFont(value ) {
        this.setState({
            font: value
        });

        localStorage.setItem('reader.font', value);
        this.props.onFontChanged(value);
    }

    toggleMenuOpen = () => this.setState(prevState => ({
        subMenuOpen: !prevState.subMenuOpen
    }));

    renderFonts(){
        var fonts = [
            { "key": "Jameel Noori Nastaleeq", "value": 'Jameel Noori Nastaleeq', "text": 'جمیل نوری نستعلیق' },
            { "key": "Mehr-Nastaleeq", "value": 'Mehr-Nastaleeq', "text": 'مہر نستعلیق' },
            { "key": "Noto", "value": 'Noto', "text": 'نوٹو' },
            { "key": "Nafees Nastaleeq", "value": 'Nafees Nastaleeq', "text": 'نفیس نستعلیق' },
            { "key": "Nafees Web Naskh", "value": 'Nafees Web Naskh', "text": 'نفیس نسخ' },
            { "key": "AdobeArabic", "value": 'AdobeArabic', "text": 'اڈوبی عربک' },
            { "key": "MehfilNaskh", "value": 'MehfilNaskh', "text": 'محفل نسخ' },
            { "key": "Dubai", "value": 'Dubai', "text": 'دبِی' },
            { "key": "UrduNaskhAsiatype", "value": 'UrduNaskhAsiatype', "text": 'اردو نسخ ایشیا ٹائپ' }
        ];

        return fonts.map(font => (<li key={font.key} className="nav-main-item" onClick={() => this.changeFont(font.value)}>
                <a className={`nav-main-link ${(this.state.font == font.value) ? 'active' : ''}`} href="javascript:void(0)">
                    <i className={ `far ${(this.state.font == font.value) ? 'fa-dot-circle' : 'fa-circle'} mr-2` } />
                    <span className="nav-main-link-name">{font.text}</span>
                </a>
            </li>));
    }

    render() {
        var value = this.state.font;
        return (<li key="chapters" className={`nav-main-item ${this.state.subMenuOpen ? 'open' : null}`}>
            <a className="nav-main-link nav-main-link-submenu" onClick={this.toggleMenuOpen} aria-haspopup="true" aria-expanded="false" href="#">
                <i className="nav-main-link-icon fa fa-font" />
                <span className="nav-main-link-name">{value}</span>
            </a>
            <ul className="nav-main-submenu">
                {this.renderFonts()}
            </ul>
        </li>)
    }
}

FontsMenu.propTypes = {
    onFontChanged: PropTypes.func.isRequired
};