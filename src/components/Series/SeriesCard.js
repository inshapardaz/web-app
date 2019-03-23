import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Button, Card, Icon } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

export default class SeriesCard extends Component {
    renderSeriesActions(series) {
        let actions = [];
        const editLink = series.links.update;
        const deleteLink = series.links.delete;
    
        if (editLink) {
          actions.push(<Button basic attached="bottom" key="edit" onClick={this.props.onEdit} >
                            <Icon name="pencil" color="green" /> <FormattedMessage id="action.edit" />
                        </Button>)
        }
        if (deleteLink) {
          actions.push(<Button basic attached="bottom" key="delete" onClick={this.props.onDelete}>
                            <Icon name="delete" color="red" /> <FormattedMessage id="action.delete" />
                        </Button>)
        }
    
        return actions;
      }

    render() {
        const {series} = this.props;
        if (series == null){
            return
        }

        return (
            <Card>
                <Card.Content>
                    <Card.Header textAlign="center">
                        <Icon name="chain" />
                        <Link to={`/books?series=${series.id}`}>{series.name}</Link>
                    </Card.Header>
                    <Card.Meta>
                        <FormattedMessage id="series.item.book.count" values={{count : series.bookCount}} />
                    </Card.Meta>
                    <Card.Description>{series.description}</Card.Description>                
                </Card.Content>
                <div className="ui bottom attached basic buttons">
                        {this.renderSeriesActions(series)}
                </div>
            </Card>
        )
    }
}
