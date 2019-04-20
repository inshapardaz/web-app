import React, { Component } from 'react'
import Footer from '../Footer';

export default class FullScreenLayout extends Component {
    render() {
        const { children } = this.props
        return (
            <>
            <div id="page-container" className="main-content-boxed">
            <main id="main-container">
                {children}
                <Footer />
            </main>
            </div>
            </>
        );
    }
}
