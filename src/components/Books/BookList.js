import React, { Component } from 'react';
import ApiService from '../../services/ApiService';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom'

import { injectIntl, FormattedMessage } from 'react-intl';
import { Segment, Card, Pagination } from 'semantic-ui-react';
import { ErrorPlaceholder, EmptyPlaceholder, Loading } from '../Common';
import BookCard from './BookCard';

class BookList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isError: false,
            isLoading: true,
            authorId: 0,
            pageNumber: 1,
            books: []
        };

        this.onPageChange = this.onPageChange.bind(this);
    }

    async componentDidMount() {
        const values = queryString.parse(this.props.location.search)
        await this.loadBooks(this.props.author, values.page? values.page : 1);
    }

    async componentWillReceiveProps(nextProps) {
        const { author } = nextProps

        const values = queryString.parse(nextProps.location.search)
    
        if (this.state.pageNumber != values.page || this.state.authorId != author.id)
        {
            await this.loadBooks(author, values.page? values.page : 1);
        }
    }

    async reloadBooks() {
        await this.loadBooks(this.props.author);
    }

    async loadBooks(author, pageNumber = 1) {
        this.setState({
            isLoading: true,
            authorId: author.id,
            pageNumber: pageNumber
        });

        try {
            let result = await ApiService.getAuthorBooks(author.links.books, pageNumber, 3);
            this.setState({
                isLoading: false,
                isError: false,
                books: result
            });
        }
        catch (e) {
            console.log('exception', e)
            this.setState({
                isLoading: false,
                isError: true
            });
        }
    }

    onPageChange(e, { activePage }) {
        if (this.state.pageNumber != activePage)
        {
            const {author} = this.props;
            if (author){
                this.props.history.push(`/authors/${author.id}?page=${activePage}`);
            }
        }
      }

    onEditClicked(){

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

    renderEmptyPlaceHolder() {
        const { intl } = this.props;
        const message = intl.formatMessage({ id: 'books.messages.empty' });
        const buttonText = intl.formatMessage({ id: 'books.action.create' });

        return (
            <EmptyPlaceholder message={message} iconName='book'
                showButton={true} buttonText={buttonText}
                buttonAction={this.reloadBooks.bind(this)} />
        );
    }

    renderBooks(books){
        return books.data.map(b =>
            <BookCard key={b.id} book={b} 
            onEdit={this.onEditClicked.bind(this, b)}
            onUpdated={this.onBookUpdated.bind(this)} />)
      }

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

        if (books && books.data && books.data.length > 0) {
            return (
                <>
                    <Segment padded={true} attached>
                        <Card.Group stackable centered>{this.renderBooks(books)}</Card.Group>
                    </Segment>
                    <Pagination defaultActivePage={pageNumber} 
                          totalPages={books.pageCount} 
                          onPageChange={this.onPageChange} 
                          pointing
                          secondary attached='bottom'/>
                </>
            )
        }
        else {
            return this.renderEmptyPlaceHolder();
        }
    }
}

export default injectIntl(withRouter(BookList));

