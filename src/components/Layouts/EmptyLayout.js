import React, { Component } from 'react'
import Navbar from '../Navbar'

export default class EmptyLayout extends Component {
    render() {
        const { children } = this.props
        return (
            <Navbar>
                {children}
            </Navbar>
        );
    }
}
