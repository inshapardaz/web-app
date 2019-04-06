import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import ApiService from '../../services/ApiService';
import { question, success, error } from '../../services/toasts';
import { injectIntl, FormattedMessage } from 'react-intl';
import EditAuthor from './EditAuthor';

class AuthorCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showEdit: false,
            active: false
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
            actions.push(<li key="edit" class="tg-facebook" onClick={this.onEdit}><i class="fa fa-edit"></i></li>)
        }

        if (author.links.image_upload) {
            actions.push(<li key="image" class="tg-twitter" onClick={() => this.uploadRef.current.click()}><i class="fa fa-picture"></i></li>)
        }

        if (author.links.delete) {
            actions.push(<li key="delete" class="tg-linkedin" onClick={this.onDeleteClicked}><i class="fa fa-delete"></i></li>);
        }

        if (actions.length > 0) {
            return (<ul class="tg-socialicons">
                {actions}
            </ul>);
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

        return (
            <>
                <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2">
                    <div class="tg-author">
                        <figure>
                            <Link to={`/authors/${author.id}`}>
                                <img src={author.links.image || '/resources/img/avatar1.jpg'} alt={author.name} onError={(e) => e.target.src = '/resources/img/avatar1.jpg'} />
                            </Link>
                        </figure>
                        <div class="tg-authorcontent">
                            <h2><Link to={`/authors/${author.id}`}>{author.name}</Link></h2>
                            <FormattedMessage id="authors.item.book.count" values={{ count: author.bookCount }} />
                            {this.renderAuthorActions(author)}
                        </div>
                    </div>
                </div>
                {this.renderEdit(author)}
                <input type="file" ref={this.uploadRef} style={{ display: "none" }} onChange={(e) => this.uploadImage(e.target.files)} />
            </>);
    }
}
export default injectIntl(AuthorCard);