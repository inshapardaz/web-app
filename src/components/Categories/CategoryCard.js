import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import { List, Card } from 'antd';

import DeleteCategory from './DeleteCategory';
import EditCategory from './EditCategory';

const { Meta } = Card;

class CategoryCard extends Component {
    renderCategoryActions(category) {
        let actions = [];
        
        if (!category || !category.links) return null;
        const editLink = category.links.update;
        const deleteLink = category.links.delete;

        if (editLink) {
            actions.push(<EditCategory category={category} onUpdated={this.props.onUpdated}/>)
        }

        if (deleteLink) {
            actions.push(<DeleteCategory category={category} onDeleted={this.props.onUpdated}/>);
        }

        if (actions.length > 0) {
            return actions;
        }

        return null;
    }

    render() {
        const { category, card } = this.props;
        if (category == null) {
            return
        }

        const title = <Link className="font-w600" to={`/books?category=${category.id}`}>{category.name}</Link>;
        const actions = this.renderCategoryActions(category);
        const bookCount = <FormattedMessage id="categories.item.book.count" values={{ count: category.bookCount }} />;

        if (card) {
            return (
                <List.Item key={category.id} >
                    <Card
                        hoverable
                        actions={actions}
                        cover={<img className="p-4" width="64px" src="/resources/img/book_tag.png" />}
                    >
                        <Meta
                            title={title}
                            description={bookCount} />
                    </Card>
                </List.Item>
            )
        }
        else {
            return (
                <List.Item key={category.id} actions={actions}>
                    <List.Item.Meta
                        avatar={<img width="48" height="48" src="/resources/img/book_tag.png" />}
                        title={title}
                        description={category.description}>
                    </List.Item.Meta>
                    <div>{bookCount}</div>
                </List.Item>
            );

        }
    }
}

export default CategoryCard;

CategoryCard.propTypes = {
    onUpdated: PropTypes.func,
    category: PropTypes.object.isRequired,
    card: PropTypes.bool
};