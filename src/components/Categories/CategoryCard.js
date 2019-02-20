import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Button, Card, Icon } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

export default class CategoryCard extends Component {
    renderCategoryActions(category) {
        let actions = [];
        const editLink = category.links.update;
        const deleteLink = category.links.delete;
    
        if (editLink) {
          actions.push(<Button basic color='green' key="edit" icon="pencil" onClick={this.props.onEdit} />)
        }
        if (deleteLink) {
          actions.push(<Button basic color='red' key="delete" icon="delete" onClick={this.props.onDelete} />)
        }
    
        return (<Button.Group icon>{actions}</Button.Group>);
      }

    render() {
        const {category} = this.props;
        if (category == null){
            return
        }

        return (
            <Card>
                <Card.Content>
                    <Card.Header textAlign="center">
                        <Icon name="folder outline" />
                        <Link to={`/books?category=${category.id}`}>{category.name}</Link>
                    </Card.Header>
                </Card.Content>
                <Card.Content>
                    <FormattedMessage id="categories.item.book.count" values={{count : 0}} />
                </Card.Content>
                <Card.Content extra>
                    <div className='ui two buttons'>
                        {this.renderCategoryActions(category)}
                    </div>
                </Card.Content>
            </Card>
        )
    }
}
