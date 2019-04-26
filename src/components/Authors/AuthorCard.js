import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { injectIntl, FormattedMessage } from 'react-intl';
import { List, Avatar, Card } from 'antd';

import EditAuthor from './EditAuthor';
import UploadAuthorImage from './UploadAuthorImage';
import DeleteAuthor from './DeleteAuthor';

const { Meta } = Card;

class AuthorCard extends Component {
    renderAuthorActions(author) {
        let actions = [];

        if (!author || !author.links) return null;
        const editLink = author.links.update;
        const deleteLink = author.links.delete;
        const imageLink = author.links.image_upload;

        if (editLink) {
            actions.push(<EditAuthor author={author} onUpdated={this.props.onUpdated} />)
        }

        if (imageLink) {
            actions.push(<UploadAuthorImage author={author} onUpdated={this.props.onUpdated} />);
        }

        if (deleteLink) {
            actions.push(<DeleteAuthor author={author} onDeleted={this.props.onUpdated} />);
        }

        if (actions.length > 0) {
            return actions;
        }

        return null;
    }
    setDefaultAuthorImage(ev){
        ev.target.src = '/resources/img/avatar1.jpg';
      }

    render() {
        const { author, card } = this.props;
        if (author == null) {
            return
        }

        const title = <Link to={`/authors/${author.id}`}>{author.name}</Link>
        const actions = this.renderAuthorActions(author)
        const bookCount = <FormattedMessage id="authors.item.book.count" values={{ count: author.bookCount }} />;

        if (card) {
            return (
                <List.Item key={author.id} >
                    <Card
                        hoverable
                        actions={actions}
                        cover={<img width={175} alt="logo" src={author.links.image || '/resources/img/avatar1.jpg'} onError={this.setDefaultAuthorImage} />}
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
                <List.Item key={author.id}
                    actions={actions}
                    extra={<img width={175} alt="logo" src={author.links.image || '/resources/img/avatar1.jpg'} onError={this.setDefaultAuthorImage} />}>
                    <List.Item.Meta title={title}>
                    </List.Item.Meta>
                    <div>{bookCount}</div>
                </List.Item>
            );

        }
    }
}
export default injectIntl(AuthorCard);

AuthorCard.propTypes = {
    onUpdated: PropTypes.func,
    author: PropTypes.object.isRequired,
    card: PropTypes.bool
};