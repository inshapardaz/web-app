import React, { Component } from 'react'
import ApiService from '../../services/ApiService';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import OwlCarousel from 'react-owl-carousel2';
import { injectIntl, FormattedMessage } from 'react-intl';

const options = {
    items: 6,
    nav: true,
    rewind: true,
    autoplay: true
};

class LatestBooks extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoading: false,
            isError: false,
            books: null
        };
    }

    async componentDidMount() {
        try {
            this.setState({ isLoading : true, isError: false })
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
            <div key={book.id} className="col-sm-6 col-md-4 col-xl-3">
                <div className="block block-rounded block-fx-pop">
                    <div className="block-content block-content-full">
                        <div className="item item-rounded bg-warning-light mx-auto my-4">
                            <i class="fa fa-2x fa-book text-warning"></i>
                        </div>
                        <h4 className="mb-2"><Link to={`/books/${book.id}`}>{book.title}</Link></h4>
                        <p className="font-size-sm text-muted text-left">
                            {this.props.intl.formatMessage({ id: 'book.by' })} <Link to={`/authors/${book.authorId}`}>{book.authorName}</Link>
                        </p>
                    </div>
                </div>
            </div>
        );
        return (<div className="item" key={book.id}>
        <div className="tg-postbook" style={{ padding : '5px 0'}} >
            <figure className="tg-featureimg">
                <div className="tg-bookimg">
                    <div className="tg-frontcover"><img src={book.links.image} alt="image description"/></div>
                    <div className="tg-backcover"><img src={book.links.image} alt="image description"/></div>
                </div>
                <Link className="tg-btnaddtowishlist" to={`/books/${book.id}`} >
                    <i className="icon-file-text2"></i>
                    <FormattedMessage id="action.view" />
                </Link>
            </figure>
            <div className="tg-postbookcontent">
                <ul className="tg-bookscategories">
                    {book.categories.map(c => <li key={c.id}><Link to={`/books?category=${c.id}`}>{c.name}</Link></li>)}
                </ul>
                <div className="tg-booktitle">
                    <h3><Link to={`/books/${book.id}`}>{book.title}</Link></h3>
                </div>
                <span className="tg-bookwriter">{this.props.intl.formatMessage({ id: 'book.by' })} <Link to={`/authors/${book.authorId}`}>{book.authorName}</Link></span>
            </div>
        </div>
    </div>);
    }

    render() {
        const { books } = this.state;
        return (
            <div id="one-remastered" className="bg-white">
                    <div className="content content-full">
                        <div className="py-5 text-center">
                            <h2 className="h1 mb-2">
                                {this.props.intl.formatMessage({id:'home.latestBooks'})}
                            </h2>
                            <div className="row">
                                { books != null ? books.slice(0,8).map(book => this.renderBook(book)) : <FormattedMessage id="message.loading" />}
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}


export default (connect(
    (state) => ({
        entry: state.apiReducers.entry
    }),
    dispatch => bindActionCreators({}, dispatch)
  )(injectIntl(LatestBooks)));