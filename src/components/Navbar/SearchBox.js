import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Search, Image } from 'semantic-ui-react'
import { injectIntl, FormattedMessage } from 'react-intl';
import ApiService from '../../services/ApiService';

class SearchBox extends Component {
    state = {
        isLoading: false,
        isError: false,
        value: '',
        results: []
    }

    bookToResult = (book) => {
        return {
            "link": `/books/${book.id}`,
            "title": book.title,
            "image": book.links.image || '/resources/img/book_placeholder.png',
            "description": book.authorName
        }
    }

    authorsToResult = (author) => {
        return {
            "link": `/authors/${author.id}`,
            "title": author.name,
            "image": author.links.image || '/resources/img/avatar1.jpg',
            "description": this.props.intl.formatMessage({ id: 'authors.item.book.count' }, { count: author.bookCount })
        }
    }

    resultRenderer = ({ link, image, price, title, description }) => [
        image && (
            <div key='image' className='image'>
                <Image src={image} size="tiny" />
            </div>
        ),
        <Link key={link} to={link}>
            <div key='content' className='content'>
                {price && <div className='price'>{price}</div>}
                {title && <div className='title'>{title}</div>}
                {description && <div className='description'>{description}</div>}
            </div>
        </Link>,
    ]
    resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })
    handleResultSelect = (e, result) => this.setState({ value: result.title })
    handleSearchChange = async (e, { value }) => {
        this.setState({
            isLoading: true,
            isError: false,
            value
        })

        try {
            var books = await ApiService.searchBooks(value, 1, 6);
            var booksData = books.data.map(b => this.bookToResult(b));
            var authors = await ApiService.searchAuthors(value, 1, 6);
            var authorData = authors.data.map(a => this.authorsToResult(a));
            var finalResult = {};

            if (booksData && booksData.length > 0) {

                finalResult.books = {
                    "name": "books",
                    "results": booksData
                };
            }
            if (authorData && authorData.length > 0) {
                finalResult.authors = {
                    "name": "authors",
                    "results": authorData
                }
            }

            this.setState({
                isLoading: false,
                results: finalResult
            })


        }
        catch (e) {
            console.error(e);
            this.setState({
                isLoading: false,
                results: [],
            })
        }
    }
    
    render() {
        const { isLoading, isError, results, value } = this.state;
        return (
            <Search category minCharacters={3} aligned='right'
                loading={isLoading}
                resultRenderer={this.resultRenderer}
                onSearchChange={this.handleSearchChange.bind(this)}
                results={results}
                value={value}
                noResultsMessage={<FormattedMessage id="search.messages.noresult" />}
                {...this.props}
            />
        )
    }
}

export default injectIntl(SearchBox);
