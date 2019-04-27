import React, { Component } from 'react'

export default class EmptyLayout extends Component {
    render() {
        const { children } = this.props
        return (
            <div id="page-container">
            {children}
            </div>
        );
    }
}
