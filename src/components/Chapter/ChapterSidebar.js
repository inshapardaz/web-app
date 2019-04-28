import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { Drawer, Button, Menu, Icon } from 'antd';

import ApiService from '../../services/ApiService';

const { SubMenu } = Menu;

export default class ChapterSidebar extends Component {
    state = {
        visible: false,
        isLoading: false,
        isError: false,
        chapters: null,
        font: "Mehr-Nastaleeq",
        size: "100%",
        theme: 'default'
    };

    async componentDidMount() {
        await this.loadData();
        this.loadFont();
        this.loadFontSize();
        this.loadTheme();
    }

    async componentWillReceiveProps(nextProps) {
        if (this.props.book.id != nextProps.book.id) {
            await this.loadData()
        }
    }

    async loadData() {
        this.setState({
            isLoading: true,
            isError: false
        });

        try {
            var chapters = await ApiService.getChapters(this.props.book.id);

            this.setState({
                isLoading: false,
                isError: false,
                chapters: chapters
            });
        }
        catch (e) {
            console.error(e);
            this.setState({
                isLoading: false,
                isError: true,
                chapters: null
            });
        }
    }

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

    loadFont = () => {
        var font = localStorage.getItem('reader.font');
        if (font) {
            this.setState({
                font: font
            });

            this.props.onFontChanged(font);
        }
    }

    loadFontSize = () => {
        var size = localStorage.getItem('reader.fontSize');
        if (size) {
            this.setState({
                size: size
            });

            this.props.onChangeFontSize(size);
        }
    }

    loadTheme = () => {
        var size = localStorage.getItem('reader.theme');
        if (size) {
            this.setState({
                size: size
            });
        }
    }

    changeFont = (e) => {
        const value = e.key;
        this.setState({
            font: value
        });

        localStorage.setItem('reader.font', value);
        this.props.onFontChanged(value);
    }

    changeFontSize = (e) => {
        const value = e.key;
        this.setState({
            size: value
        });

        localStorage.setItem('reader.fontSize', value);
        this.props.onChangeFontSize(value);
    }

    changeTheme = (e) => {
        const value = e.key;
        this.setState({
            theme: value
        });

        localStorage.setItem('reader.theme', value);
        this.props.onFontSizeChanged(value);
    }

    renderChapters() {
        const { chapters } = this.state;
        if (chapters != null) {
            return chapters.items.map(chapter => (
                <Menu.Item key={chapter.id} >
                    <Link to={`/books/${chapter.bookId}/chapters/${chapter.id}`}>
                        {chapter.title}
                    </Link>
                </Menu.Item>
            ));
        }

        return null;
    }

    renderFonts(){
        const fonts = [
            { "key": "Jameel Noori Nastaleeq","value": 'جمیل نوری نستعلیق' },
            { "key": "Mehr-Nastaleeq", "value": 'مہر نستعلیق' },
            { "key": "Noto", "value": 'نوٹو' },
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

        const selection = [this.props.selectedChapter.id.toString(), this.state.font, this.state.size]
        return (
            <>
                <Button shape="round" onClick={this.showDrawer} icon="more" />

                <Drawer title={book.title} visible={this.state.visible} mask closable onClose={this.hideDrawer}>
                    <Menu mode="inline" selectable selectedKeys={selection}>
                        <SubMenu key="chapters" title={<span><Icon type="read" /><FormattedMessage id="chapter.toolbar.chapters" /></span>}>
                            {this.renderChapters()}
                        </SubMenu>
                        <SubMenu key="sub1" title={<span><Icon type="font-colors" /><FormattedMessage id="chapter.toolbar.font" /></span>}>
                            {this.renderFonts()}
                        </SubMenu>
                        <SubMenu key="sub2" title={<span><Icon type="font-size" /><FormattedMessage id="chapter.toolbar.fontSize" /></span>}>
                            {this.renderFontSize()}
                        </SubMenu>
                        <SubMenu key="sub3" title={<span><Icon type="bg-colors" /><FormattedMessage id="chapter.toolbar.theme" /></span>}>
                            {this.renderThemes()}
                        </SubMenu>
                    </Menu>
                </Drawer>
            </>
        )
    }
}
