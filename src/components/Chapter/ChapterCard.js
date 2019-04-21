import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { List, Button, Icon, Confirm } from 'semantic-ui-react';
import { success, error } from '../../services/toasts';
import { injectIntl, FormattedMessage } from 'react-intl';
import ApiService from '../../services/ApiService';
import ChapterEditor from './ChapterEditor';

class ChapterCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDelete: false,
            showEdit: false
        };
        this.onEdit = this.onEdit.bind(this);
        this.onCloseEdit = this.onCloseEdit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.deleteChapter = this.deleteChapter.bind(this);
    }

    onEdit = () => this.setState({ showEdit: true });
    onCloseEdit = () => this.setState({ showEdit: false });
    renderEditor = (chapter) => {
        const { showEdit } = this.state;
        if (showEdit && chapter && chapter.links && chapter.links.update) {
            return (<ChapterEditor open={true} chapter={chapter}
                onOk={this.props.onUpdate}
                onClose={this.onCloseEdit} />);
        }

        return null;
    }

    onDelete = () => this.setState({ confirmDelete: true })
    deleteChapter = async () => {
        const { chapter } = this.props;
        if (!chapter) return;

        let deleteLink = chapter.links.delete;
        if (!deleteLink) return;

        this.setState({
            confirmDelete: false
        });

        try {
            await ApiService.delete(deleteLink);
            success(this.props.intl.formatMessage({ id: "chapters.messages.deleted" }));
            this.props.onUpdate();
        }
        catch (e) {
            console.error(e)
            error(this.props.intl.formatMessage({ id: "chapters.messages.error.delete" }));
        }
    }

    renderDelete() {
        const { confirmDelete } = this.state;
        const { chapter } = this.props;

        if (confirmDelete && chapter) {
            const { intl } = this.props;

            return (<Confirm size="mini" open={confirmDelete}
                content={intl.formatMessage({ id: 'chapters.action.confirmDelete' }, { title: chapter.title })}
                cancelButton={intl.formatMessage({ id: 'action.no' })}
                confirmButton={intl.formatMessage({ id: 'action.yes' })}
                onCancel={() => this.setState({ confirmDelete: false })}
                onConfirm={this.deleteChapter} closeIcon />);
        }

        return null;
    }

    renderChapterActions = (chapter) => {
        var actions = []

        if (chapter.links.update) {
            actions.push(<button type="button" key="edit" onClick={this.onEdit} className="btn btn-sm btn-light"><i className="fa fa-edit"/></button>)
        }

        if (chapter.links.delete) {
            actions.push(<button type="button" key="delete" onClick={this.onDelete} className="btn btn-sm btn-light"><i className="fa fa-trash"/></button>)
        }
        
        if (actions.length > 0) {
            return (<td className="text-center">
                <div className="btn-group">
                    {actions}
                </div>
            </td>);
        }

        return null;
    }

    render() {
        const { chapter } = this.props;

        if (!chapter) return null;
        return (
            <>
                <tr key={chapter.id}>
                    <td>{chapter.chapterNumber}</td>
                    <td>
                        <Link className="font-w300" to={`/books/${chapter.bookId}/chapters/${chapter.id}`}>{chapter.title}</Link>
                    </td>
                    {this.renderChapterActions(chapter)}
                </tr>
                {this.renderEditor(chapter)}
                {this.renderDelete()}
            </>
        )
    }
}

export default injectIntl(ChapterCard);
