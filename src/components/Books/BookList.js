import React, { Component } from 'react';
import ApiService from '../../services/ApiService';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom'

import { injectIntl } from 'react-intl';
import ReactPaginate from 'react-paginate';
import { ErrorPlaceholder, EmptyPlaceholder, Loading } from '../Common';
import BookCard from './BookCard';
import BookEditor from './BookEditor';

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
            pageNumber: 1,
            selectedBook: null,
            books: []
        };

        this.onPageChange = this.onPageChange.bind(this);
        this.onBookUpdated = this.onBookUpdated.bind(this);
    }

    async componentDidMount() {
        const values = queryString.parse(this.props.location.search)
        await this.loadBooks(this.props.author,
            values.category ? values.category : 0,
            values.series ? values.series : 0,
            values.page ? values.page : 1);
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
                values.page ? values.page : 1);
        }
    }

    async reloadBooks() {
        await this.loadBooks(this.props.author, this.state.category, this.state.series, this.state.pageNumber);
    }

    async loadBooks(author = null, category = 0, series = 0, pageNumber = 1) {
        this.setState({
            isLoading: true,
            authorId: author ? author.id : null,
            series: series,
            category: category,
            pageNumber: pageNumber
        });

        try {

            let result = [];
            if (author) {
                result = await ApiService.getAuthorBooks(author.links.books, pageNumber);
            }
            else if (category && category > 0) {
                result = await ApiService.getBooksByCategory(category, pageNumber);
            }
            else if (series && series > 0) {
                result = await ApiService.getBooksBySeries(series, pageNumber);
            }
            else {
                result = await ApiService.getBooks(pageNumber);
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

    onPageChange(data) {
        let activePage = data.selected + 1;
        if (this.state.pageNumber != activePage) {
            const { category, series } = this.state;
            const { author } = this.props;
            if (author) {
                this.props.history.push(`/authors/${author.id}?page=${activePage}`);
            }
            else if (category && category > 0) {
                this.props.history.push(`/books?category=${category}&page=${activePage}`);
            }
            else if (series && series > 0) {
                this.props.history.push(`/books?series=${series}&page=${activePage}`);
            }
            else {
                this.props.history.push(`/books?page=${activePage}`);
            }
        }
    }

    onAddClicked() {
        this.setState({
            selectedBook: {},
            isAdding: true,
        });
    }

    onCloseEdit() {
        this.setState({
            isAdding: false
        });
    }

    async onBookUpdated() {
        await this.reloadBooks();
    }

    renderLoadingError() {
        const { intl } = this.props;
        const message = intl.formatMessage({ id: 'books.messages.error.loading' });
        const buttonText = intl.formatMessage({ id: 'action.retry' });
        return (<ErrorPlaceholder message={message}
            showButton={true} buttonText={buttonText}
            buttonAction={this.reloadBooks.bind(this)} />)
    }

    renderEmptyPlaceHolder(createLink) {
        const { intl } = this.props;
        const message = intl.formatMessage({ id: 'books.messages.empty' });
        const buttonText = intl.formatMessage({ id: 'books.action.create' });

        return (
            <>
                {createLink ? this.renderEditor(createLink) : null}
                <EmptyPlaceholder message={message} iconName='book'
                    showButton={true} buttonText={buttonText}
                    buttonAction={this.onAddClicked.bind(this)} />
            </>
        );
    }

    renderEditor(createLink) {
        const { isAdding, selectedBook, authorId, series } = this.state;
        if (!isAdding) {
            return null;
        }

        console.log('rendering editor')
        if (this.props.author) {
            selectedBook.authorId = this.props.author.id;
        }

        return (<BookEditor open={true} book={selectedBook}
            authorId={authorId} seriesId={series}
            createLink={createLink} isAdding={isAdding}
            onOk={this.reloadBooks.bind(this)}
            onClose={this.onCloseEdit.bind(this)} />);
    }

    renderBooks = (books) => books.data.map(b =>
        <BookCard key={b.id} book={b} onUpdated={this.onBookUpdated} />)

    render() {
        const { books, isLoading, isError, pageNumber } = this.state;

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
            let addButton = null;
            if (createLink) {
                addButton = <button type="button" className="btn-block-option" onClick={this.onAddClicked.bind(this)}><i className="si si-plus"/></button>
            }

            if (this.props.simple) {
                return (
                    <>
                        <div className="content content-boxed">
                            <div className="row row-deck">
                                {this.renderBooks(books)}
                            </div>
                            <Pagination defaultActivePage={pageNumber}
                                    totalPages={books.pageCount}
                                    onPageChange={this.onPageChange}
                                    pointing
                                    secondary attached='bottom' />
                            {this.renderEditor(createLink)}
                        </div>
                    </>
                );
            }
            return (
                <>
                    <div className="block block-themed">
                        <div className="block-header bg-muted">
                            <h3 className="block-title">{this.props.title}</h3>
                            <div className="block-options">
                                {addButton}
                            </div>
                        </div>
                        <div className="block-content">
                            <div className="row row-deck">
                                {this.renderBooks(books)}
                            </div>
                        </div>
                        
                        <nav aria-label="Page navigation">
                        <ReactPaginate
                            previousLabel={<i className="fa fa-angle-double-left"></i>}
                            nextLabel={<i className="fa fa-angle-double-right"></i>}
                            breakLabel={'...'}
                            pageCount={books.pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={this.onPageChange}
                            initialPage={pageNumber-1}
                            containerClassName={'pagination justify-content-center'}
                            subContainerClassName={'test'}
                            breakClassName={'break-me'}
                            activeClassName={'active'}
                            pageClassName={'page-item'}
                            pageLinkClassName={'page-link'}
                            previousClassName={'page-item'}
                            previousLinkClassName={'page-link'}
                            nextClassName={'page-item'}
                            nextLinkClassName={'page-link'}/>
                            </nav>
                        </div>


                    {this.renderEditor(createLink)}
                </>
            );
        }
        else {
            return this.renderEmptyPlaceHolder(createLink);
        }
    }
}

export default injectIntl(withRouter(BookList));

