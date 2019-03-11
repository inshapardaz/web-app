import React, { Component } from 'react'
import { Container } from 'semantic-ui-react'

export default class EmptyLayout extends Component {
    render() {
        const { children } = this.props
        return (
            <Container fluid>
            {children}
            </Container>
        );
    }
}
