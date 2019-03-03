import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Confirm, Button } from 'semantic-ui-react';
import { success, error } from '../../services/toasts';
import ApiService from '../../services/ApiService';

class DeleteBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDelete: false
        }
        this.deleteBook = this.deleteBook.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onCloseDelete = this.onCloseDelete.bind(this);
    }

    onDelete = () => this.setState({ confirmDelete: true })
    onCloseDelete = () => this.setState({ confirmDelete: false });

    renderDelete(book) {
        const { intl } = this.props;
        const { confirmDelete } = this.state;

        if (confirmDelete && book) {
            return <Confirm size="mini" open={true} closeIcon
            content={intl.formatMessage({ id: 'books.action.confirmDelete' }, { title: book.title })}
            cancelButton={intl.formatMessage({ id: 'action.no' })}
            confirmButton={intl.formatMessage({ id: 'action.yes' })}
            onCancel={this.onCloseDelete}
            onConfirm={this.deleteBook} />
        }

        return null;
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
        const { book } = this.props;
        return (
            <>
                <Button key={this.props.key}
                    color={this.props.color}
                    onClick={this.onDelete}
                    inverted={this.props.inverted}
                    icon={this.props.icon}
                    fluid={this.props.fluid}
                    content={this.props.content} />
                    {this.renderDelete(book)}
            </>
        )
    }
}

export default injectIntl(DeleteBook)

DeleteBook.propTypes = {
    book: PropTypes.object.isRequired,
    key: PropTypes.string,
    color: PropTypes.string,
    onDeleted: PropTypes.func.isRequired,
    inverted: PropTypes.bool,
    icon: PropTypes.string,
    fluid: PropTypes.bool,
    content: PropTypes.object
};
