import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

class CategoriesSidebar extends Component {
    renderCategories() {
        if (this.props.categories) {
            return this.props.categories.items.map(c =>
                <tr key={c.id}>
                    <td>
                        <Link to={`/books?category=${c.id}`}><span>{c.name}</span></Link>
                    </td>
                    <td>
                        <em>{c.bookCount || 0}</em>
                    </td>
                </tr>
            );
        }
        return null;
    }
    render() {
        return (
            <div className="block block-rounded">
                <div className="block-header block-header-default text-center">
                    <h3 className="block-title">{this.props.intl.formatMessage({ id: 'header.categories' })}</h3>
                </div>

                <div className="block-content">
                    <table className="table table-striped table-borderless font-size-sm">
                        <tbody>
                            {this.renderCategories()}
                        </tbody>
                    </table>
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
)(injectIntl(CategoriesSidebar)));