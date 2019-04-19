import React, { Component } from 'react'
import Footer from '../Footer';
import Header from '../Header/Header';

export default class BoxedLayout extends Component {
    render() {
        const { children } = this.props
        return (
            <>
            <div id="page-container" className="sidebar-o sidebar-dark enable-page-overlay side-scroll page-header-fixed">
            <Header />
            {children}
            <Footer mini/>
            </div>
            </>
        );
    }
}
