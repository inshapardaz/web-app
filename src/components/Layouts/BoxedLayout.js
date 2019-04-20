import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Footer from '../Footer';
import Header from '../Header';
import SideBar from '../Sidebar';
import LocaleService from '../../services/LocaleService';

class BoxedLayout extends Component {
    render() {
        const { children } = this.props
        var className = "sidebar-o sidebar-dark side-scroll page-header-fixed page-header-dark";
        if (this.props.sidebarCollapsed){
            className = className + " sidebar-mini";
        }

        if (this.props.sidebarMobile){
            className = className + " sidebar-o-xs";
        }

        const isRtl = LocaleService.isRtl();
        if (isRtl){
            className = className + "  sidebar-r";
        }
        
        return (
            <>
                <div id="page-container" className={className}>
                    <SideBar />
                    <Header />
                    {children}
                    <Footer mini />
                </div>
            </>
        );
    }
}

export default (connect(
    (state) => ({
        sidebarCollapsed : state.uiReducer.sidebarCollapsed,
        sidebarMobile : state.uiReducer.sidebarMobile
    }),
    dispatch => bindActionCreators({
    }, dispatch)
)(BoxedLayout));
