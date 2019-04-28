import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'

import { Input, Icon, Checkbox, Avatar  } from 'antd';
import ApiService from '../../services/ApiService';


const Styles = () => {
    return (<style>{`
    .livesearch {
        opacity: 0;
        position: fixed;
        z-index: -3000;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #ffffff;
        line-height: 1.5;
      }
      .livesearch__topInput input {
        background: #eef0f4;
      }
      @media (max-width: 710px) {
        .livesearch__topInput {
          width: 30px !important;
        }
        .livesearch__topInput input {
          width: 30px !important;
          padding-left: 22px !important;
        }
        .livesearch__topInput .ant-input-prefix {
          left: 11px !important;
          pointer-events: none;
        }
      }
      .livesearch--show {
        opacity: 1;
        z-index: 3000;
      }
      .livesearch__wrapper {
        padding-top: 1.07rem;
        padding-left: 5rem;
        padding-right: 1.15rem;
      }
      @media (max-width: 767px) {
        .livesearch__wrapper {
          padding-left: 4.61rem;
          padding-right: 2.3rem;
        }
      }
      .livesearch__search {
        direction: rtl;
        margin-bottom: 1.53rem;
      }
      .livesearch__close {
        font-size: 0.92rem;
        color: #acb7bf;
        position: absolute;
        top: 2.3rem;
        left: 2.3rem;
        cursor: pointer;
        z-index: 1;
      }
      .livesearch__close:hover {
        color: #0e0b20;
      }
      .livesearch__logo {
        margin-bottom: 2.3rem;
      }
      .livesearch__logo-img {
        margin-top: 1.53rem;
        max-width: 15.38rem;
        max-height: 3.07rem;
      }
      .livesearch__input {
        width: 100%;
        border: none;
        font-size: 4.92rem;
        background-color: transparent;
        font-weight: bold;
        padding: 0;
        color: #6a7a84;
      }
      @media (max-width: 767px) {
        .livesearch__input {
          font-size: 3.07rem;
        }
      }
      .livesearch__options {
        text-align: right;
        margin: 0 0 2.3rem;
        padding: 0;
        list-style: none;
        color: #615d7c;
      }
      .livesearch__option {
        display: inline-block;
        margin-right: 2rem;
        font-size: 1rem;
      }
      .livesearch__option--checkbox {
        direction: rtl;
      }
      .livesearch__option--checkbox .ant-checkbox-wrapper span {
        font-size: 1rem;
        color: #514d6a;
      }
      .livesearch__option--checkbox .ant-checkbox-wrapper .ant-checkbox {
        top: -0.19em;
      }
      .livesearch__option--checkbox .ant-checkbox-wrapper .ant-checkbox-inner {
        border-color: #b8beca;
      }
      .livesearch__option--checkbox .ant-checkbox-wrapper .ant-checkbox-checked .ant-checkbox-inner {
        background-color: #b8beca;
      }
      .livesearch__option--checkbox .ant-checkbox-wrapper .ant-checkbox-checked:after {
        border: 1px solid #b8beca;
      }
      .livesearch__option-icon {
        font-size: 1rem;
      }
      .livesearch__option-label {
        cursor: pointer;
        position: relative;
        margin-bottom: 0;
      }
      .livesearch__suggestion {
        margin-bottom: 3.07rem;
      }
      @media (max-width: 767px) {
        .livesearch__suggestion {
          margin-bottom: 1.15rem;
        }
      }
      .livesearch__suggestion-text {
        font-weight: 700;
      }
      .livesearch__suggestion-input-text {
        font-weight: normal;
      }
      .livesearch__results {
        direction: rtl;
      }
      .livesearch__results-title {
        font-weight: 700;
        margin-bottom: 1.53rem;
        color: #615d7c;
        text-align: right;
      }
      .livesearch__result-thumb {
        display: block;
        width: 3.84rem;
        height: 3.84rem;
        border-radius: 4px;
        overflow: hidden;
        vertical-align: top;
        background-color: #acb7bf;
        color: #fff;
        line-height: 4.15rem;
        text-align: center;
        font-size: 1.38rem;
        font-weight: bold;
        background-size: cover;
        float: left;
      }
      .livesearch__result-content {
        margin-bottom: 1.53rem;
        min-height: 3.84rem;
      }
      .livesearch__result {
        display: block;
        vertical-align: top;
        margin-left: 5.38rem;
        padding-top: 0.61rem;
      }
      .livesearch__result-text {
        font-weight: 300;
        font-size: 1.53rem;
        line-height: 1;
        color: #615d7c;
      }
      @media (max-width: 575px) {
        .livesearch__result-text {
          font-size: 1.23rem;
        }
      }
      .livesearch__result-source {
        color: #c0bdd0;
      }
    `}</style>)
}
class SearchBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            searchText: '',
            searchBooks: true,
            searchAuthors: true,
            books: null,
            authors: null
        }
    }

    showLiveSearch = () => {
        this.searchInput.focus()
        this.setState({
            show: true,
        })
    }

    hideLiveSearch = () => {
        this.searchInput.blur()
        this.setState({
            show: false,
            searchText: '',
            books: null,
            authors: null
        })
    }

    changeSearchText = e => {
        this.setState({
            searchText: e.target.value,
        })
    }

    handleKeyDown = event => {
        if (this.state.show) {
            let key = event.keyCode.toString()
            if (key === '27') {  //Escape
                this.hideLiveSearch()
            }
            else if (key === '13') { //Enter
                if (this.state.searchBooks) {
                    ApiService.searchBooks(this.state.searchText, 1, 6)
                        .then(
                            (result) => {
                                this.setState({
                                    books: result
                                });
                            },
                            (error) => {
                                this.setState({
                                    isError: true
                                });
                            }
                        )
                }

                if (this.state.searchAuthors) {
                    ApiService.searchAuthors(this.state.searchText, 1, 6)
                        .then(
                            (result) => {
                                this.setState({
                                    authors: result
                                });
                            },
                            (error) => {
                                this.setState({
                                    isError: true
                                });
                            }
                        )
                }
            }
        }
    }

    componentWillMount() {
        document.addEventListener('keydown', this.handleKeyDown, false)
    }

    setDefaultBookImage(ev) {
        ev.target.src = '/resources/img/book_placeholder.png';
      }

      setDefaultAuthorImage(ev){
        ev.target.src = '/resources/img/avatar1.jpg';
      }
    renderBook(book) {
        return (
            <div className="livesearch__result-content" key={book.id}>
                <div className="livesearch__result-thumb" style={{backgroundImage: `url(${book.links.image || defaultBookImage})`}}></div>
                <div className="livesearch__result">
                    <div className="livesearch__result-text">
                        <Link to={`/books/${book.id}`} onClick={this.hideLiveSearch}> {book.title}</Link>
                    </div>
                    <div className="livesearch__result-source">{book.authorName}</div>
                </div>
            </div>);
    }

    renderAuthor(author) {
        return (
            <div className="livesearch__result-content" key={author.id}>
                <div className="livesearch__result-thumb"><Avatar src={author.links.image || defaultAuthorImage} onError={this.setDefaultAuthorImage} /></div>
                <div className="livesearch__result">
                    <div className="livesearch__result-text">
                        <Link to={`/authors/${author.id}`} onClick={this.hideLiveSearch}> {author.name}</Link>
                    </div>
                    <div className="livesearch__result-source">{author.bookCount} کتابیں</div>
                </div>
            </div>);
    }

    renderBooks(books) {
        if (!books || books.data.length < 1) {
            return (<div className="col-lg-8">
                <div className="livesearch__result-content">
                    <div className="livesearch__result">
                        <span className="livesearch__result-text">کوئی کتاب موجود نہیں</span>
                    </div>
                </div>
            </div>);
        }

        var bookNodes = books.data.map(b => this.renderBook(b));

        var column1 = (
            <div className="col-lg-4">
                {bookNodes.slice(0, 3)}</div>);

        var column2 = (
            <div className="col-lg-4">
                {bookNodes.slice(3, 6)}
            </div>);
        return (
            <div className="row">
                {column1}
                {bookNodes.length > 3 || column2}
            </div>
        );
    }

    renderAuthors(authors) {
        if (!authors || authors.data.length < 1) {
            return (<div className="col-lg-8">
                <div className="livesearch__result-content">
                    <div className="livesearch__result">
                        <span className="livesearch__result-text">کوئی مصنّف موجود نہیں</span>
                    </div>
                </div>
            </div>);
        }

        var authorNodes = authors.data.map(a => this.renderAuthor(a));

        var column1 = (
            <div className="col-lg-4">
                {authorNodes.slice(0, 3)}</div>);

        var column2 = (
            <div className="col-lg-4">
                {authorNodes.slice(3, 6)}
            </div>);
        return (
            <div className="row">
                {column1}
                {authorNodes.length > 3 || column2}
            </div>
        );
    }

    render() {
        const searchMessage = this.props.intl.formatMessage({ id: "header.search.placeholder" });
        let { show, searchText, books, authors } = this.state

        const booksResult = this.renderBooks(books);
        const authorsResult = this.renderAuthors(authors);

        return (
            <>
                <Input
                    className="livesearch__topInput"
                    placeholder={searchMessage}
                    prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    style={{ width: 200 }}
                    onFocus={this.showLiveSearch}
                />
                <Styles />
                <div
                    className={show === true ? 'livesearch livesearch--show' : 'livesearch'}
                    id="livesearch"
                >
                    <div className="livesearch__close" onClick={this.hideLiveSearch}>
                        <Icon type="close" />
                    </div>
                    <div className="container-fluid">
                        <div className="livesearch__wrapper">
                            <div className="livesearch__logo">
                                <img className="livesearch__logo-img" src="/resources/img/logo.png" alt="" />
                            </div>
                            <div className="livesearch__search">
                                <input
                                    type="search"
                                    className="livesearch__input"
                                    value={searchText}
                                    onChange={this.changeSearchText}
                                    id="livesearchInput"
                                    placeholder="تلاش کے لیے لکھیں۔۔۔"
                                    ref={ele => (this.searchInput = ele)}
                                />
                            </div>
                            <ul className="livesearch__options">
                                <li className="livesearch__option">تلاش کے لیے اینٹر دبائیں</li>
                                <li className="livesearch__option livesearch__option--checkbox">
                                    <Checkbox checked={this.state.searchBooks}>کتاب کی تلاش</Checkbox>
                                </li>

                                <li className="livesearch__option livesearch__option--checkbox">
                                    <Checkbox checked={this.state.searchAuthors}>مصنّف کی تلاش</Checkbox>
                                </li>

                            </ul>
                            <div className="livesearch__results">
                                <div className="livesearch__results-title">
                                    <span className="livesearch__results-title-text">کتابوں کے نتائج</span>
                                </div>
                                {booksResult}
                                <div className="livesearch__results-title">
                                    <span className="livesearch__results-title-text">مصنّفین کےنتاِئج</span>
                                </div>
                                {authorsResult}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default withRouter(injectIntl(SearchBox));
