import React, { Component } from 'react'
import Navbar from '../Navbar'
import Footer from '../Footer';
import Header from '../Header/Header';

export default class BoxedLayout extends Component {
    render() {
        const { children } = this.props
        return (
            <>
            <Header />
            {/* <Navbar> */}
                {children}
            {/* </Navbar> */}
            <Footer mini/>
            </>
        );
    }
}
