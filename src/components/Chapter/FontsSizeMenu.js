import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class FontsSizeMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
            fontSize: '100%',
            subMenuOpen: false
        };

        this.changeFontSize = this.changeFontSize.bind(this);
    }

    sizes = [
        { "key": "80", "value": '80%', "text": 'Very Small' },
        { "key": "90", "value": '90%', "text": 'Small' },
        { "key": "100", "value": '100%', "text": 'Medium' },
        { "key": "120", "value": '120%', "text": 'Large' },
        { "key": "150", "value": '150%', "text": 'Very Large' },
        { "key": "170", "value": '170%', "text": 'Huge' }
    ];

    componentWillMount() {
        var fontSize = localStorage.getItem('reader.fontSize');
        if (fontSize) {
            this.setState({
                fontSize: fontSize
            });

            this.props.onFontSizeChanged(fontSize);
        }
    }

    changeFontSize(value) {
        this.setState({
            fontSize: value
        });

        localStorage.setItem('reader.fontSize', value);
        this.props.onFontSizeChanged(value);
    }

    toggleMenuOpen = () => this.setState(prevState => ({
        subMenuOpen: !prevState.subMenuOpen
    }));

    renderSizes() {
        return this.sizes.map(size => (<li key={size.key} className="nav-main-item" onClick={() => this.changeFontSize(size.value)}>
                <a className={`nav-main-link ${(this.state.fontSize == size.value) ? 'active' : ''}`} href="javascript:void(0)">
                    <i className={ `far ${(this.state.fontSize == size.value) ? 'fa-dot-circle' : 'fa-circle'} mr-2` } />
                    <span className="nav-main-link-name">{size.text}</span>
                </a>
            </li>));
    }

    render() {
        var value = this.sizes.find((element) => {
            return element.value === this.state.fontSize;
          });
        return (<li key="chapters" className={`nav-main-item ${this.state.subMenuOpen ? 'open' : null}`}>
            <a className="nav-main-link nav-main-link-submenu" onClick={this.toggleMenuOpen} aria-haspopup="true" aria-expanded="false" href="#">
                <i className="nav-main-link-icon fa fa-sort-amount-up" />
                <span className="nav-main-link-name">{value.text}</span>
            </a>
            <ul className="nav-main-submenu">
                {this.renderSizes()}
            </ul>
        </li>)
    }
}

FontsSizeMenu.propTypes = {
    onFontSizeChanged: PropTypes.func.isRequired
};