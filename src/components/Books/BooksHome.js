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
      series: null
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
      <>
        <BooksHeader title={headerContent} />
        <main id="tg-main" className="tg-main tg-haslayout">
          <div className="tg-sectionspace tg-haslayout">
            <div className="container">
              <div className="row">
                <div id="tg-twocolumns" className="tg-twocolumns">
                  <div className="col-xs-12 col-sm-8 col-md-8 col-lg-9 pull-right">
                    <BookList title={headerContent} />
                  </div>
                  <div className="col-xs-12 col-sm-4 col-md-4 col-lg-3 pull-left">
                    <aside id="tg-sidebar" className="tg-sidebar">
                      <div className="tg-widget tg-widgetsearch">
                        <form className="tg-formtheme tg-formsearch">
                          <div className="form-group">
                            <button type="submit"><i className="icon-magnifier"></i></button>
                            <input type="search" name="search" className="form-group" placeholder={this.props.intl.formatMessage({ id: "header.search.placeholder" })} />
                          </div>
                        </form>
                      </div>
                      <CategoriesSidebar />
                      <FavoriteBooksSidebar />
                      <LatestBooksSidebar />
                      </aside>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }
}

export default injectIntl(BooksHome)

class BooksHeader extends React.Component {
  render() {
    return (
      <div className="tg-innerbanner tg-haslayout tg-parallax tg-bginnerbanner" data-z-index="-100" data-appear-top-offset="600" style={{ backgroundImage: `url('/images/parallax/bgparallax-07.jpg')` }}>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div className="tg-innerbannercontent">
                <h1>{this.props.title}</h1>
                <ol className="tg-breadcrumb">
                  <li><Link to="/"><FormattedMessage id="header.home" /></Link></li>
                  <li className="tg-active"><FormattedMessage id="header.books" /></li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>);
  }
}
