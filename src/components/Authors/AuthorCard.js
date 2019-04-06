import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import { Card } from 'react-bootstrap';
import ApiService from '../../services/ApiService';
import { question, success, error } from '../../services/toasts'; 
import { injectIntl, FormattedMessage } from 'react-intl';
import EditAuthor from './EditAuthor';

class AuthorCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showEdit: false,
            active : false
        };

        this.uploadRef = React.createRef();
        this.onEdit = this.onEdit.bind(this);
        this.renderEdit = this.renderEdit.bind(this);
        this.onCloseEdit = this.onCloseEdit.bind(this);
        this.onDeleteClicked = this.onDeleteClicked.bind(this);
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

    onDeleteClicked() {
        const { author } = this.props;
        const yesAction = this.props.intl.formatMessage({ id: 'action.yes' });
        const noAction = this.props.intl.formatMessage({ id: 'action.no' });
        const message = this.props.intl.formatMessage({ id: 'authors.action.confirmDelete' }, { name: author.name });
        question(message, yesAction, this.deleteAuthor, noAction);
    }

    async deleteAuthor() {
        const { author } = this.props;
        if (!author) return;

        let deleteLink = author.links.delete;
        if (!deleteLink) return;

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
            actions.push(<Card.Link key="edit" onClick={this.onEdit} >
                            <Icon name="pencil" color="green" />
                        </Card.Link>)
        }

        if (author.links.image_upload) {
            actions.push(<Card.Link key="image" onClick={() => this.uploadRef.current.click()} >
                            <Icon name="picture"/>
                        </Card.Link>)
        }

        if (author.links.delete) {
            actions.push(<Card.Link key="delete" onClick={this.onDeleteClicked}>
                            <Icon name="delete" color="red"/>
                        </Card.Link>)
        }

        if (actions.length > 0) {
            return (<Card.Footer>
                {actions}
            </Card.Footer>);
        }

        return null;
    }


    handleShow = () => this.setState({ active: true })
    handleHide = () => this.setState({ active: false })

    render() {
        const { author } = this.props;
        const { active } = this.state;

        if (author == null) {
            return
        }

        return (<>
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={author.links.image || '/resources/img/avatar1.jpg'} onError={(e) => e.target.src='/resources/img/avatar1.jpg'} />
            <Card.Body>
                <Card.Title><Link to={`/authors/${author.id}`}>{author.name}</Link></Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                    <FormattedMessage id="authors.item.book.count" values={{ count: author.bookCount }} />
                </Card.Subtitle>
            </Card.Body>
            {this.renderAuthorActions(author)}
        </Card>
        {this.renderEdit(author)}
        <input type="file" ref={this.uploadRef} style={{ display: "none" }} onChange={(e) => this.uploadImage(e.target.files)} />
        </>);
    }
}
export default injectIntl(AuthorCard);