import React, { Component } from 'react'
import Navbar from '../Navbar'
import Footer from '../Footer';

export default class FullScreenLayout extends Component {
    render() {
        const { children } = this.props
        return (
            <>
            <Navbar>
                {children}
            </Navbar>
            <Footer />
            </>
        );
    }
}
