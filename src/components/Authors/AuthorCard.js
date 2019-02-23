import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Button, Card, Icon, Image } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

export default class AuthorCard extends Component {
    renderAuthorActions(author) {
        let actions = [];
        const editLink = author.links.update;
        const deleteLink = author.links.delete;
    
        if (editLink) {
          actions.push(<Button key="edit" onClick={this.props.onEdit} basic attached="bottom">
                            <Icon name="pencil" /> <FormattedMessage id="action.edit" />
                    </Button>)
        }
        if (deleteLink) {
          actions.push(<Button key="delete" onClick={this.props.onDelete} basic  attached="bottom">
                            <Icon name="delete" /> <FormattedMessage id="action.delete" />
                    </Button>)
        }
    
        return actions;
      }

    render() {
        const {author} = this.props;
        if (author == null){
            return
        }

        return (
            <Card >
                <Image src={author.links.image || '/resources/img/avatar1.jpg'} height="300px" as={Link} to={`/authors/${author.id}`}/>
                <Card.Content>
                    <Card.Header >
                        {author.name}
                    </Card.Header>
                    <Card.Meta>
                        <FormattedMessage id="authors.item.book.count" values={{count : author.bookCount}} />
                    </Card.Meta>
                </Card.Content>
                <div className="ui bottom attached basic buttons">
                    {this.renderAuthorActions(author)}
                </div>
            </Card>
        )
    }
}
