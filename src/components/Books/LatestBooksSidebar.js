import React, { Component } from 'react'
import ApiService from '../../services/ApiService';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';

class LatestBooksSidebar extends Component {
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
            let result = await ApiService.get(this.props.entry.links.latest);
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

    render() {
        const { books } = this.state;

        return (
            <div className="tg-widget tg-widgettrending">
                <div className="tg-widgettitle">
                    <h3>{this.props.intl.formatMessage({ id: 'home.latestBooks' })}</h3>
                </div>
                <div className="tg-widgetcontent">
                    <ul>
                        {books != null ? books.slice(1, 5).map(book => this.renderBook(book)) : <FormattedMessage id="message.loading" />}
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
)(injectIntl(LatestBooksSidebar)));