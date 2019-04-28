export function toggleSidebar() {
    return {
        type: 'SIDEBAR_VISIBLE'
    }
}

export function closeSidebarCompact() {
    return {
        type: 'CLOSE_SIDEBAR_MOBILE'
    }
}

export function toggleSidebarCompact() {
    return {
        type: 'SIDEBAR_VISIBLE_MOBILE'
    }
}

export function changeReaderFont(font) {
    localStorage.setItem('reader.font', font);
    return {
        type: 'READER_FONT',
        value: font
    }
}

export function changeReaderFontSize(fontSize) {
    localStorage.setItem('reader.fontSize', fontSize);
    return {
        type: 'READER_FONT_SIZE',
        value: fontSize
    }
}

export function changeReaderTheme(theme) {
    localStorage.setItem('reader.theme', theme);
    return {
        type: 'READER_THEME',
        value: theme
    }
}