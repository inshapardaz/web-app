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

    render() {
        const { books } = this.state;
        return (
            <div className="block block-rounded">
                <div className="block-header block-header-default text-center">
                    <h3 className="block-title">{this.props.intl.formatMessage({ id: 'home.latestBooks' })}</h3>
                </div>

                <div className="block-content">
                    <table className="table table-striped table-borderless font-size-sm">
                        <tbody>
                            {books != null ? books.slice(1, 5).map(book => this.renderBook(book)) :
                                <tr>
                                    <td className="text-center">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="sr-only"><FormattedMessage id="message.loading" /></span>
                                        </div>
                                    </td>
                                </tr>}
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
)(injectIntl(LatestBooksSidebar)));