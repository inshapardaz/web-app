import React, { Component } from 'react'
import Footer from '../Footer';
import Header from '../Header/Header';

export default class FullScreenLayout extends Component {
    render() {
        const { children } = this.props
        return (
            <>
            <div id="page-container" className="main-content-boxed">
            <main id="main-container">
                {/* <Header /> */}
                {children}
                <Footer />
            </main>
            </div>
            </>
        );
    }
}
