import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';

import { changeReaderFont, changeReaderFontSize, changeReaderTheme } from '../../actions/uiActions';

import { Button, Menu, Dropdown } from 'antd';
import { FontColorsOutlined, FontSizeOutlined, BgColorsOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;

class ChapterSidebar extends Component {
    state = {
        visible: false
    };

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    hideDrawer = () => {
        this.setState({
            visible: false,
        });
    }

    changeFont = (e) => this.props.changeReaderFont(e.key)

    changeFontSize = (e) => this.props.changeReaderFontSize(e.key)

    changeTheme = (e) => this.props.changeReaderTheme(e.key)

    renderFonts() {
        const fonts = [
            { "key": "Jameel Noori Nastaleeq", "value": 'جمیل نوری نستعلیق' },
            { "key": "Mehr-Nastaleeq", "value": 'مہر نستعلیق' },
            { "key": "Noto", "value": 'نوٹو' },
            { "key": "Alvi Lahori Nastaleeq", "value": "علوی نستعلیق"},
            { "key": "Nafees Nastaleeq", "value": 'نفیس نستعلیق' },
            { "key": "Nafees Web Naskh", "value": 'نفیس نسخ' },
            { "key": "AdobeArabic", "value": 'اڈوبی عربک' },
            { "key": "MehfilNaskh", "value": 'محفل نسخ' },
            { "key": "Dubai", "value": 'دبِی' },
            { "key": "UrduNaskhAsiatype", "value": 'اردو نسخ ایشیا ٹائپ' }
        ];

        return fonts.map(font => (
            <Menu.Item key={font.key} onClick={this.changeFont}>{font.value}</Menu.Item>
        ))
    }

    renderFontSize() {
        const sizes = [
            { "key": "80%", "value": 'Very Small' },
            { "key": "90%", "value": 'Small' },
            { "key": "100%", "value": 'Medium' },
            { "key": "120%", "value": 'Large' },
            { "key": "150%", "value": 'Very Large' },
            { "key": "170%", "value": 'Huge' }
        ];

        return sizes.map(size => (
            <Menu.Item key={size.key} onClick={this.changeFontSize}>{size.value}</Menu.Item>
        ))
    }

    renderThemes() {
        const themes = [
            { "key": "default", "value": 'Default' },
            { "key": "sepia", "value": 'Sepia' },
            { "key": "dark", "value": 'Dark' }
        ];

        return themes.map(theme => (
            <Menu.Item key={theme.key} onClick={this.changeTheme}>{theme.value}</Menu.Item>
        ))
    }

    render() {

        const { book } = this.props;

        if (!book) return null;

        const selection = [this.props.font, this.props.fontSize, this.props.theme]
        const menu = (<Menu selectable selectedKeys={selection}>
            <SubMenu key="sub1" title={<span><FontColorsOutlined /><FormattedMessage id="chapter.toolbar.font" /></span>}>
                {this.renderFonts()}
            </SubMenu>
            <SubMenu key="sub2" title={<span><FontSizeOutlined /><FormattedMessage id="chapter.toolbar.fontSize" /></span>}>
                {this.renderFontSize()}
            </SubMenu>
            <SubMenu key="sub3" title={<span><BgColorsOutlined /><FormattedMessage id="chapter.toolbar.theme" /></span>}>
                {this.renderThemes()}
            </SubMenu>
        </Menu>);
        return (
            <>
                <Dropdown trigger={['click']} overlay={menu}>
                    <Button><i className="fa fa-cog"/></Button>
                </Dropdown>
            </>
        )
    }
}

export default (connect(
    (state) => ({
        font: state.uiReducer.font,
        fontSize: state.uiReducer.fontSize,
        theme: state.uiReducer.theme
    }),
    dispatch => bindActionCreators({
        changeReaderFont: changeReaderFont,
        changeReaderFontSize: changeReaderFontSize,
        changeReaderTheme: changeReaderTheme
    }, dispatch)
)(ChapterSidebar));