import React, { Component } from 'react';
import ApiService from '../../services/ApiService';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom'

import { injectIntl, FormattedMessage } from 'react-intl';
import { Segment, Card, Pagination, Button, Icon } from 'semantic-ui-react';
import { ErrorPlaceholder, EmptyPlaceholder, Loading } from '../Common';
import BookCard from './BookCard';
import BookEditor from './BookEditor';

class BookList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isError: false,
            isLoading: true,
            isAdding : false,
            authorId: 0,
            category: 0,
            series:0,
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
                             values.category? values.category : 0, 
                             values.series? values.series : 0, 
                             values.page? values.page : 1);
    }

    async componentWillReceiveProps(nextProps) {
        const { author } = nextProps

        const values = queryString.parse(nextProps.location.search)
    
        if (this.state.pageNumber != values.page || 
            //this.state.authorId != author ? author.id : 0 ||
            this.state.series != values.series ||
            this.state.category != values.category)
        {
            await this.loadBooks(author, 
                                 values.category? values.category : 0, 
                                 values.series? values.series : 0,
                                 values.page? values.page : 1);
        }
    }

    async reloadBooks() {
        await this.loadBooks(this.props.author, this.state.pageNumber);
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
            else if (category && category > 0){
                result = await ApiService.getBooksByCategory(category, pageNumber);
            }
            else if (series && series > 0){
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

    onPageChange(e, { activePage }) {
        if (this.state.pageNumber != activePage)
        {
            const { category } = this.state;
            const { author } = this.props;
            if (author){
                this.props.history.push(`/authors/${author.id}?page=${activePage}`);
            }
            else if (category && category > 0){
                this.props.history.push(`/books?category=${category}&page=${activePage}`);
            }
            else if (series && series > 0){
                this.props.history.push(`/books?series=${series}&page=${activePage}`);
            }
            else {
                this.props.history.push(`/books?page=${activePage}`);
            }
        }
      }

    onAddClicked(){
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
    
    async onBookUpdated(){
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
                { createLink ? this.renderEditor(createLink) : null }
                <EmptyPlaceholder message={message} iconName='book'
                    showButton={true} buttonText={buttonText}
                    buttonAction={this.onAddClicked.bind(this)} />
            </>
        );
    }

    renderEditor(createLink) {
        const { isAdding, selectedBook, authorId, series } = this.state;
        if (!isAdding) return null;
        
        if (this.props.author){
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
            addButton = (
                    <Button onClick={this.onAddClicked.bind(this)} icon attached='top' ><Icon name='add' />
                    <FormattedMessage id="books.action.create" />
                    </Button>);
            }

            return (
                <>
                    {addButton}
                    <Segment padded={true} attached>
                        <Card.Group stackable centered>{this.renderBooks(books)}</Card.Group>
                    </Segment>
                    <Pagination defaultActivePage={pageNumber} 
                          totalPages={books.pageCount} 
                          onPageChange={this.onPageChange} 
                          pointing
                          secondary attached='bottom'/>
                    {this.renderEditor(createLink)}
                </>
            )
        }
        else {
            return this.renderEmptyPlaceHolder(createLink);
        }
    }
}

export default injectIntl(withRouter(BookList));

