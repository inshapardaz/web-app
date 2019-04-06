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
                <span className="tg-bookwriter"><Link to={`/authors/${book.authorId}`}>{book.authorName}</Link></span>
            </div>
        </div>
    </div>);
    }

    render() {
        const { books } = this.state;
        return (
            <section className="tg-sectionspace tg-haslayout">
				<div className="container">
					<div className="row">
						<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
							<div className="tg-sectionhead">
								<h2>{this.props.intl.formatMessage({id:'home.latestBooks'})}</h2>
							</div>
						</div>
						<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <OwlCarousel ref="car" options={options} >
                                { books != null ? books.map(book => this.renderBook(book)) : <FormattedMessage id="message.loading" />}
                            </OwlCarousel>
						</div>
					</div>
				</div>
			</section>
        )
    }
}


export default (connect(
    (state) => ({
        entry: state.apiReducers.entry
    }),
    dispatch => bindActionCreators({}, dispatch)
  )(injectIntl(LatestBooks)));