import React, { Component } from 'react'
import AppFooter from '../AppFooter';

import { Layout } from 'antd';

const { Content } = Layout;

export default class FullScreenLayout extends Component {
    render() {
        const { children } = this.props
        return (
            <>
                <Content >
                    {children}
                </Content>
                <AppFooter />
            </>
        );
    }
}
