import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { Card } from 'react-bootstrap';

export default class CategoryCard extends Component {
    renderCategoryActions(category) {
        let actions = [];
        const editLink = category.links.update;
        const deleteLink = category.links.delete;
    
        if (editLink) {
          actions.push(<Card.Link key="edit" onClick={this.props.onEdit} >
                            <Icon name="pencil" color="green" /> <FormattedMessage id="action.edit" />
                        </Card.Link>)
        }
        if (deleteLink) {
          actions.push(<Card.Link key="delete" onClick={this.props.onDelete}>
                            <Icon name="delete" color="red" /> <FormattedMessage id="action.delete" />
                        </Card.Link>)
        }

        if (actions.length > 0) {
            return (<Card.Footer>
                {actions}
            </Card.Footer>);
        }
    
        return null;
      }

    render() {
        const {category} = this.props;
        if (category == null){
            return
        }

        return (<Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src="/resources/img/series.svg" height="180" width="286" />
            <Card.Body>
                <Card.Title><Link to={`/books?category=${category.id}`}>{category.name}</Link></Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                    <FormattedMessage id="categories.item.book.count" values={{count : 0}} />
                </Card.Subtitle>
            </Card.Body>
            {this.renderCategoryActions(category)}
        </Card>);
    }
}
