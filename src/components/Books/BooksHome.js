import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import BookList from './BookList';
import queryString from 'query-string';
import ApiService from '../../services/ApiService';
import { FormattedMessage, injectIntl } from 'react-intl';
import CategoriesSidebar from '../Categories/CategoriesSidebar';
import LatestBooksSidebar from './LatestBooksSidebar';
import FavoriteBooksSidebar from './FavoriteBooksSidebar';

class BooksHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryId: 0,
      authorId: 0,
      seriesId: 0,
      author: null,
      category: null,
      series: null,
      searchQuery: '',
    }
  }

  async componentDidMount() {
    const values = queryString.parse(this.props.location.search);

    if (values.category && values.category > 0) {
      await this.loadData(0, values.category, 0);
    }

    if (values.author && values.author > 0) {
      await this.loadData(values.author, 0, 0);
    }

    if (values.series && values.series > 0) {
      await this.loadData(0, 0, values.series);
    }


  }

  async componentWillReceiveProps(nextProps) {
    const values = queryString.parse(nextProps.location.search)

    if (values.category && this.state.categoryId != values.category) {
      await this.loadData(0, values.category, 0);
    }

    if (values.author && this.state.authorId != values.author) {
      await this.loadData(0, 0, values.author, 0, 0);
    }

    if (values.series && this.state.seriesId != values.series) {
      await this.loadData(0, 0, values.series);
    }
  }

  async loadData(authorId = 0, categoryId = 0, seriesId = 0) {
    try {
      if (author > 0) {
        this.setState({ authorId: authorId })
        var author = await ApiService.getAuthor(authorId);
        this.setState({ author: author });
      }

      if (categoryId > 0) {
        this.setState({ categoryId: categoryId })
        var category = await ApiService.getCategory(categoryId);
        this.setState({ category: category });
      }

      if (seriesId > 0) {
        this.setState({ seriesId: seriesId })
        var series = await ApiService.getSeriesById(seriesId);
        this.setState({ series: series });
      }
    }
    catch (e) {
      console.error(e);
    }
  }

  searchChange = (event) => {
    this.setState({
      searchQuery: event.target.value
    });
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.props.history.push(`/books?q=${this.state.searchQuery}`)
  }


  render() {
    const { author, category, series } = this.state;

    let headerContent = <FormattedMessage id="header.books" />;
    if (author) {
      headerContent = author.name;
    }
    else if (category) {
      headerContent = category.name;
    }
    else if (series) {
      headerContent = series.name;
    }
    return (
      <main id="main-container">
        <BooksHeader title={headerContent} />
        <div className="content content-boxed">
          <div className="row">
            <div className="col-xl-8">
              <BookList title={headerContent} />
            </div>
            <div className="col-xl-4">
              <div className="block">
                <div className="block-header block-header-default">
                  <h3 className="block-title">Search</h3>
                </div>
                <div className="block-content block-content-full">
                  <form method="POST" onSubmit={this.onSubmit}>
                    <div className="input-group">
                      <input type="text" className="form-control form-control-alt" placeholder={this.props.intl.formatMessage({ id: "header.search.placeholder" })}
                        onChange={this.searchChange} value={this.state.searchQuery} />
                      <div className="input-group-append">
                        <button className="btn btn-primary">
                          <i className="fa fa-search"></i>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <CategoriesSidebar />
              <FavoriteBooksSidebar />
              <LatestBooksSidebar />
            </div>
          </div>
        </div>
      </main >
    );
  }
}

export default injectIntl(BooksHome)

class BooksHeader extends React.Component {
  render() {
    return (
      <div className="bg-image overflow-hidden" style={{ backgroundImage: "url('assets/media/photos/photo3@2x.jpg')" }}>
        <div className="bg-primary-dark-op">
          <div className="content content-narrow content-full">
            <div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center mt-5 mb-2 text-center text-sm-left">
              <div className="flex-sm-fill">
                <h1 className="font-w600 text-white mb-0" data-toggle="appear"><FormattedMessage id="header.books" /></h1>
                <h2 className="h4 font-w400 text-white-75 mb-0" data-toggle="appear" data-timeout="250">{this.props.title}</h2>
              </div>
              {this.props.createLink ?
                (<div className="flex-sm-00-auto mt-3 mt-sm-0 ml-sm-3">
                  <span className="d-inline-block" data-toggle="appear" data-timeout="350">
                    <a className="btn btn-primary px-4 py-2" data-toggle="click-ripple" href="javascript:void(0)" onClick={this.props.onCreate}>
                      <i className="fa fa-plus mr-1"></i> <FormattedMessage id="books.action.create" />
                    </a>
                  </span>
                </div>) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
