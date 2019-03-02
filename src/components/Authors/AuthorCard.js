import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Button, Card, Icon, Image, Confirm } from 'semantic-ui-react';
import ApiService from '../../services/ApiService';
import { success, error } from '../../services/toasts';
import { injectIntl, FormattedMessage } from 'react-intl';
import EditAuthor from './EditAuthor';

class AuthorCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDelete: false,
            showEdit: false
        };

        this.uploadRef = React.createRef();
        this.onEdit = this.onEdit.bind(this);
        this.renderEdit = this.renderEdit.bind(this);
        this.onCloseEdit = this.onCloseEdit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.deleteAuthor = this.deleteAuthor.bind(this);
    }

    async uploadImage(files) {
        const { author } = this.props;

        if (author.links.image_upload && files && files.length) {
            try
            {
                await ApiService.upload(author.links.image_upload, files[0]);
                this.props.onUpdated();
            }
            catch{
                error(this.props.intl.formatMessage({ id: "authors.messages.error.saving" }));
            }
        }
    }

    onEdit = () => this.setState({showEdit : true});
    onCloseEdit = () => this.setState({showEdit : false});
    renderEdit = (author) => {
        if (this.state.showEdit && author) {
          return (<EditAuthor open={true} author={author}
            onOk={this.props.onUpdated}
            onClose={this.onCloseEdit} />);
        }
    
        return null;
    }

    onDelete = () => this.setState({ confirmDelete: true });

    renderDelete() {
        const { confirmDelete } = this.state;
        const { author } = this.props;

        if (confirmDelete && author) {
            const { intl } = this.props;

            return (<Confirm size="mini" open={confirmDelete}
                content={intl.formatMessage({ id: 'authors.action.confirmDelete' }, { name: author.name })}
                cancelButton={intl.formatMessage({ id: 'action.no' })}
                confirmButton={intl.formatMessage({ id: 'action.yes' })}
                onCancel={() => this.setState({ confirmDelete: false })}
                onConfirm={this.deleteAuthor} closeIcon />);
        }

        return null;
    }

    async deleteAuthor() {
        const { author } = this.props;
        if (!author) return;

        let deleteLink = author.links.delete;
        if (!deleteLink) return;

        this.setState({
            confirmDelete: false
        });

        try {
            await ApiService.delete(deleteLink);
            success(this.props.intl.formatMessage({ id: "authors.messages.deleted" }));
            this.props.onUpdated();
        }
        catch{
            error(this.props.intl.formatMessage({ id: "authors.messages.error.delete" }));
        }
    }

    renderAuthorActions(author) {
        let actions = [];

        if (author.links.update) {
            actions.push(<Button key="edit" onClick={this.onEdit} basic attached="bottom" animated>
                <Button.Content visible><Icon name="pencil" color="green" /></Button.Content>
                <Button.Content hidden><FormattedMessage id="action.edit" /></Button.Content>
            </Button>)
        }

        if (author.links.image_upload) {
            actions.push(<Button key="image" onClick={() => this.uploadRef.current.click()} basic animated attached="bottom">
                <Button.Content visible><Icon name='photo' /></Button.Content>
                <Button.Content hidden><FormattedMessage id="action.changeImage" /></Button.Content>
                <input type="file" ref={this.uploadRef} style={{ display: "none" }} onChange={(e) => this.uploadImage(e.target.files)} />
            </Button>)
        }

        if (author.links.delete) {
            actions.push(<Button key="delete" onClick={this.onDelete} basic animated attached="bottom">
                <Button.Content visible><Icon name="delete" color="red" /> </Button.Content>
                <Button.Content hidden><FormattedMessage id="action.delete" /></Button.Content>
            </Button>)
        }

        return actions;
    }

    render() {
        const { author } = this.props;
        if (author == null) {
            return
        }

        return (
            <>
                <Card >
                    <Image src={author.links.image || '/resources/img/avatar1.jpg'} height="300px" as={Link} to={`/authors/${author.id}`} />
                    <Card.Content>
                        <Card.Header >
                            {author.name}
                        </Card.Header>
                        <Card.Meta>
                            <FormattedMessage id="authors.item.book.count" values={{ count: author.bookCount }} />
                        </Card.Meta>
                    </Card.Content>
                    <div className="ui bottom attached basic buttons">
                        {this.renderAuthorActions(author)}
                    </div>
                </Card>
                {this.renderEdit(author)}
                {this.renderDelete()}
            </>
        )
    }
}
export default injectIntl(AuthorCard);