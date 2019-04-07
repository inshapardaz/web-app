import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

class CategoriesSidebar extends Component {
    renderCategories() {
        if (this.props.categories){
            return this.props.categories.items.map(c => 
                <li key={c.id}><Link to={`/books?category=${c.id}`}><span>{c.name}</span><em>{c.bookCount || 0}</em></Link></li>
            );
        }
        return null;
    }
    render() {
        return (
            <div className="tg-widget tg-catagories">
                <div className="tg-widgettitle">
                    <h3><FormattedMessage id="header.categories" /></h3>
                </div>
                <div className="tg-widgetcontent">
                    <ul>
                        {this.renderCategories()}
                    </ul>
                </div>
            </div>
        )
    }
}


export default (connect(
    (state) => ({
        categories: state.apiReducers.categories
    }),
    dispatch => bindActionCreators({
    }, dispatch)
)(CategoriesSidebar));