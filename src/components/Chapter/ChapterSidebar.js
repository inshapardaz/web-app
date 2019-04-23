import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import FontsSizeMenu from './FontsSizeMenu';
import FontsMenu from './FontsMenu';
import ChaptersMenu from './ChaptersMenu';

export default class ChapterSidebar extends Component {
    render() {

        const { book } = this.props;

        if (!book) return null;

        return (
            <nav id="sidebar" aria-label="Main Navigation">
                <div className="content-header bg-white-5">
                    <Link className="font-w600 text-dual" to="/">
                        <img className="mr-2" src="/resources/img/logo.png" height="16" width="16" />
                        <span className="smini-hide">
                            <FormattedMessage id="app" />
                        </span>
                    </Link>
                    <div>
                        <a className="d-lg-none text-dual ml-3" onClick={this.props.onClose}>
                            <i className="fa fa-times" />
                        </a>
                    </div>
                </div>
                <div className="content-side content-side-full">
                    <ul className="nav-main">
                        <li key="book" className="nav-main-item" >
                            <Link className="nav-main-link" to={`/books/${book.id}`}>
                                <i className="nav-main-link-icon fa fa-book" />
                                <span className="nav-main-link-name">{book.title}</span>
                            </Link>
                        </li>
                        <ChaptersMenu bookId={book.id} selectedChapter={this.props.selectedChapter}/>
                        <li className="nav-main-heading"><FormattedMessage id="header.settings" /></li>
                        <FontsMenu onFontChanged={this.props.onChangeFont} />
                        <FontsSizeMenu onFontSizeChanged={this.props.onChangeFontSize} />
                    </ul>
                </div>
            </nav>
        )
    }
}
