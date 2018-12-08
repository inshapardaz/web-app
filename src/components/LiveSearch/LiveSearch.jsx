import React from 'react'
import {connect} from 'react-redux';
import {Link} from 'react-router-dom'
import { Input, Icon } from 'antd'
import { Checkbox } from 'antd'

import ApiService from '../../services/api';

import './style.scss'

class LiveSearch extends React.Component {
  constructor(props)
  {
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
        const api = new ApiService(this.props.user);
        if (this.state.searchBooks) {
          api.searchBooks(this.state.searchText, 1, 6)
            .then(
              (result) => {
                this.setState({
                  books: result
                });
              },
              (error) => {
                this.setState({
                  isError:true
                });
              }
            )
        }

        if (this.state.searchAuthors) {
          api.searchAuthors(this.state.searchText, 1, 6)
          .then(
            (result) => {
              this.setState({
                authors: result
              });
            },
            (error) => {
              this.setState({
                isError:true
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

  renderBook(book) {
    return (
    <div className="livesearch__result-content" key={book.id}>
      <div className="livesearch__result-thumb"><i className="icmn icmn-book"/></div>
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
      <div className="livesearch__result-thumb"><i className="icmn icmn-user"/></div>
      <div className="livesearch__result">
        <div className="livesearch__result-text">
          <Link to={`/authors/${author.id}`} onClick={this.hideLiveSearch}> {author.name}</Link>
        </div>
        <div className="livesearch__result-source">{author.bookCount} کتابیں</div>
      </div>
    </div>);
  }

  renderBooks(books) {
    if (!books || books.data.length < 1)
    {
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
        {bookNodes.length>3 || column2}
      </div>
    );
  }

  renderAuthors(authors) {
    if (!authors || authors.data.length < 1)
    {
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
        {authorNodes.length>3 || column2}
      </div>
    );
  }

  render() {
    let { show, searchText, books, authors } = this.state

    const booksResult = this.renderBooks(books);
    const authorsResult = this.renderAuthors(authors);

    return (
      <div className="d-inline-block mr-4">
        <Input
          className="livesearch__topInput"
          placeholder="تلاش کے لیے لکھیں۔۔۔"
          prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
          style={{ width: 200 }}
          onFocus={this.showLiveSearch}
        />

        <div
          className={show === true ? 'livesearch livesearch--show' : 'livesearch'}
          id="livesearch"
        >
          <div className="livesearch__close" onClick={this.hideLiveSearch}>
            <i className="icmn-cross" />
          </div>
          <div className="container-fluid">
            <div className="livesearch__wrapper">
              <div className="livesearch__logo">
                <img className="livesearch__logo-img" src="resources/images/inshapardaz_black.png" alt="" />
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
                <li className="livesearch__option livesearch__option--checkbox">
                  <Checkbox checked={this.state.searchBooks}>کتاب کی تلاش</Checkbox>
                </li>

                <li className="livesearch__option livesearch__option--checkbox">
                  <Checkbox checked={this.state.searchAuthors}>مصنّف کی تلاش</Checkbox>
                </li>
                <li className="livesearch__option">تلاش کے لیے اینٹر دبائیں</li>
              </ul>
              <div className="livesearch__results">
                <div className="livesearch__results-title">
                  <span className="livesearch__results-title-text">کتابوں کے نتائج</span>
                </div>
                {booksResult}
                <div className="livesearch__results-title">
                  <span className="livesearch__results-title-text">مصنّفین کےنتاِج</span>
                </div>
                {authorsResult}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({
    user: state.oidc.user
}), null)(LiveSearch);
