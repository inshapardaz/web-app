import React, { Component } from 'react'
import ApiService from '../../services/ApiService';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Spin, Card, Avatar, List } from 'antd';

const defaultBookImage = '/resources/img/book_placeholder.png';

const cardStyle = {
    marginBottom: "12px"
}

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
            <List.Item.Meta
                key={book.id}
                avatar={<Avatar shape="square" size="large" src={book.links.image || defaultBookImage} onError={this.setDefaultBookImage} />}
                title={<Link to={`/books/${book.id}`}>{book.title}</Link>}
                description={<Link to={`/authors/${book.authorId}`}>{book.authorName}</Link>}
            />
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

    setDefaultBookImage(ev) {
        ev.target.src = defaultBookImage;
    }

    render() {
        const { books, isLoading } = this.state;
        if (isLoading) {
            return <Spin />
        }

        if (books == null) return null;
        return (
            <Card title={this.props.intl.formatMessage({ id: 'home.favoriteBooks' })} type="inner" style={cardStyle}>
                <List
                    dataSource={books.data}
                    loading={isLoading}
                    itemLayout="horizontal"
                    locale={{
                        emptyText: this.props.intl.formatMessage({ id: 'books.messages.favorite.empty' })
                    }}
                    renderItem={book => (
                        <List.Item key={book.id}>
                            {this.renderBook(book)}
                        </List.Item>
                    )}
                />
            </Card>
        );
    }
}


export default (connect(
    (state) => ({
        entry: state.apiReducers.entry
    }),
    dispatch => bindActionCreators({}, dispatch)
)(injectIntl(FavoriteBooksSidebar)));