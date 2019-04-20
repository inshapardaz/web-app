import React, { Component } from 'react'
import Footer from '../Footer';
import Header from '../Header/Header';

export default class BoxedLayout extends Component {
    render() {
        const { children } = this.props
        return (
            <>
            <div id="page-container" className="enable-page-overlay side-scroll page-header-fixed page-header-dark">
            <Header />
            {children}
            <Footer mini/>
            </div>
            </>
        );
    }
}
