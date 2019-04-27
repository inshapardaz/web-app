import React, { Component } from 'react'
import queryString from 'query-string';

import { FormattedMessage, injectIntl } from 'react-intl';
import { Card, Input } from 'antd';

import ApiService from '../../services/ApiService';
import BookList from './BookList';
import CategoriesSidebar from '../Categories/CategoriesSidebar';
import LatestBooksSidebar from './LatestBooksSidebar';
import FavoriteBooksSidebar from './FavoriteBooksSidebar';

const Search = Input.Search;
const cardStyle = {
  marginBottom: "12px"
}

class BooksPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryId: 0,
      authorId: 0,
      seriesId: 0,
      author: null,
      category: null,
      series: null,
      query: ''
    }
  }

  async componentDidMount() {
    const values = queryString.parse(this.props.location.search);

    this.setState({ query: values.q ? values.q : '' });

    if (values.category && values.category > 0) {
      await this.loadData(0, values.category, 0);
    } else if (values.author && values.author > 0) {
      await this.loadData(values.author, 0, 0);
    } else if (values.series && values.series > 0) {
      await this.loadData(0, 0, values.series);
    } else {
      await this.loadData()
    }
  }

  async componentWillReceiveProps(nextProps) {
    const values = queryString.parse(nextProps.location.search);
    this.setState({ query: values.q ? values.q : '' });

    if (values.category && this.state.categoryId != values.category) {
      await this.loadData(0, values.category);
    } else if (values.author && this.state.authorId != values.author) {
      await this.loadData(0, 0, values.author);
    } else if (values.series && this.state.seriesId != values.series) {
      await this.loadData(0, 0, values.series);
    } else {
      await this.loadData();
    }
  }

  async loadData(authorId = 0, categoryId = 0, seriesId = 0) {
    try {
      this.setState({ authorId: authorId })
      this.setState({ categoryId: categoryId })
      this.setState({ seriesId: seriesId })

      if (author > 0) {
        var author = await ApiService.getAuthor(authorId);
        this.setState({ author: author });
      }

      if (categoryId > 0) {
        var category = await ApiService.getCategory(categoryId);
        this.setState({ category: category });
      }

      if (seriesId > 0) {
        var series = await ApiService.getSeriesById(seriesId);
        this.setState({ series: series });
      }
    }
    catch (e) {
      console.error(e);
    }
  }

  onSubmit = (value) => {
    let values = queryString.parse(this.props.location.search)
    values.q = value;
    this.props.history.push(`${this.props.location.pathname}?${queryString.stringify(values)}`)
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
        <div className="content content-boxed">
          <div className="row">
            <div className="col-xl-8">
              <BookList title={headerContent} />
            </div>
            <div className="col-xl-4">
              <Card title={this.props.intl.formatMessage({ id: 'header.search' })} type="inner" style={cardStyle}>
                <Search
                  placeholder={this.props.intl.formatMessage({ id: "header.search.placeholder" })}
                  onSearch={this.onSubmit}
                  enterButton
                />
              </Card>
              <CategoriesSidebar selectedCategory={category} />
              <FavoriteBooksSidebar />
              <LatestBooksSidebar />
            </div>
          </div>
        </div>
      </main >
    );
  }
}

export default injectIntl(BooksPage)