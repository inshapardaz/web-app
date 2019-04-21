import React, { Component } from 'react'
import ApiService from '../../services/ApiService';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';

class FavoriteBooksSidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isError: false,
            books: null
        };
    }

    async componentDidMount() {
        try {
            this.setState({ isLoading: true, isError: false })
            let result = await ApiService.get(this.props.entry.links.favorites);
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

    renderBook(book) {
        return (
            <tr key={book.id}>
                <td>
                    <Link to={`/books/${book.id}`}><img src={book.links.image} alt={book.title} style={{ width: '77px' }} /></Link>
                </td>
                <td>
                    <h4><Link className="font-w300" to={`/books/${book.id}`}>{book.title}</Link><br /></h4>
                    <span >{this.props.intl.formatMessage({ id: 'book.by' })} <Link to={`/authors/${book.authorId}`}>{book.authorName}</Link></span>
                </td>
            </tr>
        );
    }

    renderBooks(books) {
        if (books == null) {
            return <tr>
                <td className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only"><FormattedMessage id="message.loading" /></span>
                    </div>
                </td>
            </tr>;
        }

        if (books.data.length < 1) {
            return <tr><td><FormattedMessage id="books.messages.favorite.empty" /></td></tr>
        }

        return books.data.slice(1, 5).map(book => this.renderBook(book));
    }

    render() {
        const { books } = this.state;
        if (!books) {
            return null;
        }

        return (
            <div className="block block-rounded">
                <div className="block-header block-header-default text-center">
                    <h3 className="block-title">{this.props.intl.formatMessage({ id: 'home.favoriteBooks' })}</h3>
                </div>

                <div className="block-content">
                    <table className="table table-striped table-borderless font-size-sm">
                        <tbody>
                            {this.renderBooks(books)}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}


export default (connect(
    (state) => ({
        entry: state.apiReducers.entry
    }),
    dispatch => bindActionCreators({}, dispatch)
)(injectIntl(FavoriteBooksSidebar)));