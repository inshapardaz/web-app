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
            actions.push(<button type="button" key="edit" className="btn-block-option" onClick={this.onEdit}><i className="far fa-fw fa-edit"></i></button>)
        }

        if (author.links.image_upload) {
            actions.push(<button type="button" key="image" className="btn-block-option" onClick={() => this.uploadRef.current.click()}><i className="far fa-fw fa-image"></i></button>)
        }

        if (author.links.delete) {
            actions.push(<button type="button" key="delete" className="btn-block-option" onClick={this.onDeleteClicked}><i className="far fa-fw fa-trash-alt"></i></button>);
        }

        if (actions.length > 0) {
            return actions;
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
            <div className="col-md-6 col-lg-4 col-xl-3">
                <div className="block block-rounded block-link-pop" >
                    <div className="block-content block-content-full text-center bg-image" style={{ backgroundImage: `url('${author.links.image || '/resources/img/avatar1.jpg'}')` }} >
                        <div className="py-7" />
                    </div>
                    <div className="block-content block-content-full">
                        <h4 className="mb-1"><Link to={`/authors/${author.id}`}>{author.name}</Link></h4>
                        <div className="font-size-sm text-muted"><FormattedMessage id="authors.item.book.count" values={{ count: author.bookCount }} /></div>
                        {this.renderAuthorActions(author)}
                    </div>
                </div>
                {this.renderEdit(author)}
                <input type="file" ref={this.uploadRef} style={{ display: "none" }} onChange={(e) => this.uploadImage(e.target.files)} />
                
            </div>
        );
    }
}
export default injectIntl(AuthorCard);