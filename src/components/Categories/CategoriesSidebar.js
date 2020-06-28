import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { injectIntl } from 'react-intl';
import { Button, Card } from 'antd';

class CategoriesSidebar extends Component {
    renderCategories() {
        const { selectedCategory } = this.props;
        const buttonStyle = {
            marginBottom: "12px"
        }

        if (this.props.categories) {
            const allButton = [(<Button type={selectedCategory ? "default" : "primary"} block key="all" style={buttonStyle}>
                <Link to={`/books`} >{this.props.intl.formatMessage({ id : 'header.books.list'})}</Link>
            </Button>)];
            const cats = this.props.categories.data.map(c =>
                <Button type={ selectedCategory && c.id == selectedCategory.id ? "primary" : "default"} block key={c.id} style={buttonStyle}>
                    <Link to={`/books?category=${c.id}`} >{c.name}</Link>
                </Button>
            );

            return allButton.concat(cats);
        }
        return null;
    }
    render() {
        const cardStyle = {
            marginBottom: "12px"
        }

        return (
            <Card title={this.props.intl.formatMessage({ id: 'header.categories' })} type="inner" style={cardStyle}>
                {this.renderCategories()}
            </Card>
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

CategoriesSidebar.propTypes = {
    selectedCategory: PropTypes.object
};
