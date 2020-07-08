import React, { Component } from 'react';
import ApiService from '../../services/ApiService';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';

import { injectIntl } from 'react-intl';

import { Pagination, List, Card, Switch } from 'antd';
import { Helmet } from 'react-helmet'

import { ErrorPlaceholder } from '../Common';
import BookCard from './BookCard';
import EditBook from './EditBook';

const cardStyle = {
    marginBottom: "12px"
}

class BookList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isError: false,
            isLoading: true,
            isAdding: false,
            authorId: 0,
            category: 0,
            series: 0,
            query: null,
            pageNumber: 1,
            selectedBook: null,
            showCard: true,
            books: null
        };

        this.onPageChanged = this.onPageChanged.bind(this);
    }

    async componentDidMount() {
        this.setState({
            showCard: JSON.parse(localStorage.getItem('booklist.cardview'))
        })

        const values = queryString.parse(this.props.location.search)
        await this.loadBooks(this.props.author,
            values.category ? values.category : 0,
            values.series ? values.series : 0,
            values.page ? values.page : 1,
            values.q ? values.q : null);
    }

    async componentWillReceiveProps(nextProps) {
        const { author } = nextProps

        const values = queryString.parse(nextProps.location.search)

        if (this.state.pageNumber != values.page ||
            //this.state.authorId != author ? author.id : 0 ||
            this.state.series != values.series ||
            this.state.category != values.category) {
            await this.loadBooks(author,
                values.category ? values.category : 0,
                values.series ? values.series : 0,
                values.page ? values.page : 1,
                values.q ? values.q : null);
        }
    }

    reloadBooks = async () => {
        await this.loadBooks(this.props.author, this.state.category, this.state.series, this.state.pageNumber, this.state.query);
    }

    async loadBooks(author = null, category = 0, series = 0, pageNumber = 1, query = null) {
        this.setState({
            isLoading: true,
            authorId: author ? author.id : null,
            series: series,
            category: category,
            query: query,
            pageNumber: parseInt(pageNumber)
        });

        try {

            let result = [];
            if (author) {
                result = await ApiService.getAuthorBooks(author.id, pageNumber, 12, query);
            }
            else if (category && category > 0) {
                result = await ApiService.getBooksByCategory(category, pageNumber, 12, query);
            }
            else if (series && series > 0) {
                result = await ApiService.getBooksBySeries(series, pageNumber, 12, query);
            }
            else {
                result = await ApiService.getBooks(pageNumber, 12, query);
            }
            this.setState({
                isLoading: false,
                isError: false,
                books: result
            });
        }
        catch (e) {
            console.error(e)
            this.setState({
                isLoading: false,
                isError: true
            });
        }
    }

    onPageChanged = (page) => {
        if (this.state.pageNumber != page) {
            const { category, series } = this.state;
            const { author, search } = this.props;
            if (author) {
                this.props.history.push(`/authors/${author.id}?page=${page}`);
            }
            else if (category && category > 0) {
                this.props.history.push(`/books?category=${category}&page=${page}`);
            }
            else if (series && series > 0) {
                this.props.history.push(`/books?series=${series}&page=${page}`);
            }
            else if (search) {
                this.props.history.push(`/search?q=${search}&page=${page}`);
            }
            else {
                this.props.history.push(`/books?page=${page}`);
            }
        }
    }

    renderLoadingError() {
        const { intl } = this.props;
        const message = intl.formatMessage({ id: 'books.messages.error.loading' });
        const buttonText = intl.formatMessage({ id: 'action.retry' });
        return (<ErrorPlaceholder message={message} fullWidth={true}
            showButton={true} buttonText={buttonText}
            buttonAction={this.reloadBooks.bind(this)} />)
    }

    renderBooks = (books, isLoading) => {
        const { showCard, pageNumber } = this.state;
        const grid = this.props.wide ?
            { gutter: 4, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 5 } :
            { gutter: 4, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 };
        const pagination = books ? (<Pagination hideOnSinglePage
            size="small" showSizeChanger={false}
            current={pageNumber}
            total={books ? books.totalCount : 0}
            pageSize={books ? books.pageSize : 0}
            onChange={this.onPageChanged} />) : null;
            console.log(`isloading`, isLoading);
        return (<List
            itemLayout={showCard ? null : "vertical"}
            size="small"
            loading={isLoading}
            locale={{
                emptyText: this.props.intl.formatMessage({ id: 'books.messages.empty' })
            }}
            grid={showCard ? grid : null}
            dataSource={books ? books.data: []}
            renderItem={b => (<BookCard key={b.id} card={showCard} book={b} onUpdated={this.reloadBooks} />)}
            header={this.props.noPaginate ? null : pagination }
            footer={this.props.noPaginate ? null : pagination }
        />);
    }

    renderAdd(createLink) {
        if (createLink) {
            return <EditBook button createLink={createLink} isAdding={true} onUpdated={this.reloadBooks} />
        }

        return null;
    }

    onToggleCardView(checked) {
        localStorage.setItem('booklist.cardview', checked);
        this.setState({ showCard: checked })
    }

    render() {
        const { books, isLoading, isError } = this.state;

        if (isError) {
            return this.renderLoadingError();
        }

        const createLink = (books && books.links) ? books.links.create : null;

        if (this.props.simple) {
            return (
                <>
                    <div className="content content-boxed">
                        <div className="row row-deck">
                            {this.renderBooks(books, isLoading)}
                        </div>
                    </div>
                </>
            );
        }

        const extras = (<>
            {this.renderAdd(createLink)}
            <span className="ml-2" />
            <Switch checkedChildren={this.props.intl.formatMessage({ id: "action.card" })}
                unCheckedChildren={this.props.intl.formatMessage({ id: "action.list" })}
                onChange={this.onToggleCardView.bind(this)} checked={this.state.showCard} />
        </>)
        return (
            <>
                <Helmet title={`${this.props.intl.formatMessage({ id: "header.books" })} > ${this.props.title}`} />
                <Card title={this.props.title} type="inner" extra={extras} style={cardStyle} >
                    {this.renderBooks(books, isLoading)}
                </Card>
            </>
        );
    }
}

export default injectIntl(withRouter(BookList));

BookList.propTypes = {
    onUpdated: PropTypes.func,
    simple: PropTypes.bool,
    title: PropTypes.string,
    search: PropTypes.string,
    noPaginate: PropTypes.bool
};