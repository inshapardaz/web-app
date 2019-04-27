import React, { Component } from 'react';
import ApiService from '../../services/ApiService';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';

import { injectIntl } from 'react-intl';

import { Pagination, List, Card, Switch } from 'antd';
import { Helmet } from 'react-helmet'

import { ErrorPlaceholder, EmptyPlaceholder, Loading } from '../Common';
import BookCard from './BookCard';
import EditBook from './EditBook';

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
            books: []
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
            values.q? values.q: null);
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
                values.q? values.q: null);
        }
    }

    async reloadBooks() {
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
                result = await ApiService.getAuthorBooks(author.links.books, pageNumber, 12, query);
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
            const { author } = this.props;
            if (author) {
                this.props.history.push(`/authors/${author.id}?page=${page}`);
            }
            else if (category && category > 0) {
                this.props.history.push(`/books?category=${category}&page=${page}`);
            }
            else if (series && series > 0) {
                this.props.history.push(`/books?series=${series}&page=${page}`);
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

    renderEmptyPlaceHolder(createLink) {
        const { intl } = this.props;
        const message = intl.formatMessage({ id: 'books.messages.empty' });

        return (
            <EmptyPlaceholder fullWidth={true} description={message} iconName='book' showButton={false} >
                {this.renderAdd(createLink)}
            </EmptyPlaceholder>);
    }

    renderBooks = (books) => {
        const { showCard, pageNumber } = this.state;
        const grid = this.props.wide ?  
                        { gutter: 4, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 6 } : 
                        { gutter: 4, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }
        return (<List
            itemLayout={showCard ? null : "vertical"}
            size="small"
            grid={showCard ? grid : null}
            dataSource={books.data}
            renderItem={b => (<BookCard key={b.id} card={showCard} book={b} onUpdated={this.reloadBooks} />)}
            footer={<Pagination hideOnSinglePage
                defaultCurrent={pageNumber}
                total={books.totalCount}
                pageSize={books.pageSize}
                onChange={this.onPageChanged} />}
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

        if (isLoading) {
            return <Loading />;
        }

        if (isError) {
            return this.renderLoadingError();
        }

        if (!books) {
            return null;
        }

        const createLink = (books && books.links) ? books.links.create : null;
        if (books && books.data && books.data.length > 0) {

            if (this.props.simple) {
                return (
                    <>
                        <Helmet title={this.props.intl.formatMessage({ id: "header.books" })} />
                        <div className="content content-boxed">
                            <div className="row row-deck">
                                {this.renderBooks(books)}
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
                    <Card title={this.props.title} type="inner" extra={extras} >
                        {this.renderBooks(books)}
                    </Card>
                </>
            );
        }
        else {
            return this.renderEmptyPlaceHolder(createLink);
        }
    }
}

export default injectIntl(withRouter(BookList));

BookList.propTypes = {
    onUpdated: PropTypes.func,
    simple: PropTypes.bool,
    title: PropTypes.string
};