import React, { Component } from 'react'
import ApiService from '../../services/ApiService';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import OwlCarousel from 'react-owl-carousel2';
import { injectIntl, FormattedMessage } from 'react-intl';
import BookList from './BookList';
const defaultBookImage = '/resources/img/book_placeholder.png';

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
            let result = await ApiService.getLatestBooks(1, 8);
            this.setState({
                isLoading: false,
                isError: false,
                books: result.data
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
                                <BookList books={books} simple={true} noPaginate={true} / >
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