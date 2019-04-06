import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Confirm, Icon  } from 'semantic-ui-react';
import { Card } from 'react-bootstrap';
import { success, error, question } from '../../services/toasts';
import ApiService from '../../services/ApiService';

class DeleteBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDelete: false
        }
        this.deleteBook = this.deleteBook.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    onDelete()
    {
        const { book } = this.props;
        const yesAction = this.props.intl.formatMessage({ id: 'action.yes' });
        const noAction = this.props.intl.formatMessage({ id: 'action.no' });
        const message = this.props.intl.formatMessage({ id: 'books.action.confirmDelete' }, { title: book.title });
        question(message, yesAction, this.deleteBook, noAction);
    }

    async deleteBook() {
        const { book, intl } = this.props;
        if (!book) return;

        let deleteLink = book.links.delete;
        if (!deleteLink) return;

        this.setState({
            confirmDelete: false
        });

        try {
            await ApiService.delete(deleteLink);
            success(intl.formatMessage({ id: "books.messages.deleted" }));
            this.props.onDeleted();
        }
        catch (e){
            console.error(e)
            error(intl.formatMessage({ id: "books.messages.error.delete" }));
        }
    }

    render() {
        return (<li key={this.props.key} className="tg-linkedin"  onClick={this.onDelete}><i className="fa fa-trash"></i></li>);
    }
}

export default injectIntl(DeleteBook)

DeleteBook.propTypes = {
    book: PropTypes.object.isRequired,
    key: PropTypes.string,
    onDeleted: PropTypes.func.isRequired
};
