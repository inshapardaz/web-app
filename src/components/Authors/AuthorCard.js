import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Button, Card, Image, Confirm, Dimmer } from 'semantic-ui-react';
import ApiService from '../../services/ApiService';
import { success, error } from '../../services/toasts';
import { injectIntl, FormattedMessage } from 'react-intl';
import EditAuthor from './EditAuthor';

class AuthorCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDelete: false,
            showEdit: false,
            active : false
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
            try {
                await ApiService.upload(author.links.image_upload, files[0]);
                this.props.onUpdated();
            }
            catch{
                error(this.props.intl.formatMessage({ id: "authors.messages.error.saving" }));
            }
        }
    }

    onEdit = () => this.setState({ showEdit: true });
    onCloseEdit = () => this.setState({ showEdit: false });
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
            actions.push(<Button key="edit" onClick={this.onEdit} inverted color="green" icon="pencil" />)
        }

        if (author.links.image_upload) {
            actions.push(<Button key="image" onClick={() => this.uploadRef.current.click()} inverted color="olive" icon="picture" />)
        }

        if (author.links.delete) {
            actions.push(<Button key="delete" onClick={this.onDelete} inverted color="red" icon="delete" />)
        }

        return actions;
    }


    handleShow = () => this.setState({ active: true })
    handleHide = () => this.setState({ active: false })

    render() {
        const { author } = this.props;
        const { active } = this.state;

        if (author == null) {
            return
        }

        const content = (
            <div>
                <Button inverted as={Link} primary to={`/authors/${author.id}`}><FormattedMessage id="action.view" /></Button>
                <Button.Group icon={true} buttons={this.renderAuthorActions(author)} />
            </div>
        )

        return (
            <>
                <Card >
                    <Dimmer.Dimmable
                        blurring
                        as={Image}
                        dimmed={active}
                        dimmer={{ active, content }}
                        onMouseEnter={this.handleShow}
                        onMouseLeave={this.handleHide}
                        height="600px"
                        src={author.links.image || '/resources/img/avatar1.jpg'}
                    />
                    <Card.Content>
                        <Card.Header >
                            {author.name}
                        </Card.Header>
                        <Card.Meta>
                            <FormattedMessage id="authors.item.book.count" values={{ count: author.bookCount }} />
                        </Card.Meta>
                    </Card.Content>
                </Card>
                {this.renderEdit(author)}
                {this.renderDelete()}
                <input type="file" ref={this.uploadRef} style={{ display: "none" }} onChange={(e) => this.uploadImage(e.target.files)} />
            </>
        )
    }
}
export default injectIntl(AuthorCard);