import React, { Component } from 'react'
import Footer from '../Footer';
import Header from '../Header/Header';

export default class FullScreenLayout extends Component {
    render() {
        const { children } = this.props
        return (
            <>
            <Header />
            {children}
            <Footer />
            </>
        );
    }
}
