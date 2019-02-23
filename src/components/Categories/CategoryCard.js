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
          actions.push(<Button basic attached="bottom" key="edit" onClick={this.props.onEdit} >
                            <Icon name="pencil" /> <FormattedMessage id="action.edit" />
                        </Button>)
        }
        if (deleteLink) {
          actions.push(<Button basic attached="bottom" key="delete" onClick={this.props.onDelete}>
                            <Icon name="delete" /> <FormattedMessage id="action.delete" />
                        </Button>)
        }
    
        return actions;
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
                        <Icon name="folder" />
                        <Link to={`/books?category=${category.id}`}>{category.name}</Link>
                    </Card.Header>
                </Card.Content>
                <Card.Content>
                    <FormattedMessage id="categories.item.book.count" values={{count : 0}} />
                </Card.Content>
                <div className="ui bottom attached basic buttons">
                        {this.renderCategoryActions(category)}
                </div>
            </Card>
        )
    }
}
