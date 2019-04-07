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
            <li key={book.id}>
                <article className="tg-post">
                    <figure><Link to={`/books/${book.id}`}><img src={book.links.image} alt={book.title} style={{width: '77px'}} /></Link></figure>
                    <div className="tg-postcontent">
                        <div className="tg-posttitle">
                            <h3><Link to={`/books/${book.id}`}>{book.title}</Link></h3>
                        </div>
                        <span className="tg-bookwriter">{this.props.intl.formatMessage({ id: 'book.by' })} <Link to={`/authors/${book.authorId}`}>{book.authorName}</Link></span>
                    </div>
                </article>
            </li>
        );
    }

    renderBooks(books) 
    {
        if (books == null)
        {
            return <FormattedMessage id="message.loading" />;
        }

        if (books.data.length < 1)
        {
            return <FormattedMessage id="books.messages.favorite.empty" />
        }
        
        return books.data.slice(1, 5).map(book => this.renderBook(book));
    }

    render() {
        const { books } = this.state;
        if (!books)
        {
            return null;
        }

        return (
            <div className="tg-widget tg-widgettrending">
                <div className="tg-widgettitle">
                    <h3>{this.props.intl.formatMessage({ id: 'home.favoriteBooks' })}</h3>
                </div>
                <div className="tg-widgetcontent">  
                    <ul>
                        {this.renderBooks(books)}
                    </ul>
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