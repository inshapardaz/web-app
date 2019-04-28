import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AppFooter from '../AppFooter';
import AppHeader from '../AppHeader';
import LocaleService from '../../services/LocaleService';
import { Layout } from 'antd';

const { Content } = Layout;
class BoxedLayout extends Component {
    render() {
        const { children } = this.props
        var className = "sidebar-o sidebar-dark side-scroll page-header-fixed page-header-dark";
        if (this.props.sidebarCollapsed) {
            className = className + " sidebar-mini";
        }

        if (this.props.sidebarMobile) {
            className = className + " sidebar-o-xs";
        }

        const isRtl = LocaleService.isRtl();
        if (isRtl) {
            className = className + "  sidebar-r";
        }

        return (
            <Layout>
                <AppHeader />
                <Layout style={{ padding: '24px' }}>
                    <Content style={{
                        background: '#fff', padding: 24, margin: 0, minHeight: 280,
                    }} >
                        {children}
                    </Content>
                </Layout>
                <AppFooter mini />
            </Layout>
        );
    }
}

export default (connect(
    (state) => ({
        sidebarCollapsed: state.uiReducer.sidebarCollapsed,
        sidebarMobile: state.uiReducer.sidebarMobile
    }),
    dispatch => bindActionCreators({
    }, dispatch)
)(BoxedLayout));
