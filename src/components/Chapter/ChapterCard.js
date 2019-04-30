import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';

import { List, Icon, Card } from 'antd';

import { success, error } from '../../services/toasts';
import { injectIntl, FormattedMessage } from 'react-intl';
import ApiService from '../../services/ApiService';
import EditChapter from './EditChapter';
import DeleteChapter from './DeleteChapter';

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
            return (<EditChapter open={true} chapter={chapter}
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

    editContents = () => {
        const { chapter } = this.props;
        this.props.history.push(`/books/${chapter.bookId}/chapters/${chapter.id}/edit`)
    }
    renderChapterActions = (chapter) => {
        var actions = []

        if (!chapter || !chapter.links) return null;
        const editLink = chapter.links.update;
        const deleteLink = chapter.links.delete;
        const editContentLink = chapter.links.add_contents || chapter.links.update_contents;

        if (editLink) {
            actions.push(<EditChapter key="edit" chapter={chapter} onUpdated={this.props.onUpdated}/>)
        }

        if (editContentLink){
            actions.push(<Icon type="form" onClick={this.editContents} />);
        }

        if (deleteLink) {
            actions.push(<DeleteChapter key="delete" onClick={this.onDelete} chapter={chapter} onDeleted={this.props.onUpdated} />)
        }
        
        return actions;
    }

    render() {
        const { chapter, hideActions } = this.props;

        if (!chapter) return null;

        return (
            <List.Item key={chapter.id} actions={hideActions ? null : this.renderChapterActions(chapter)}>
                <List.Item.Meta
                    title={<Link className="font-w300" to={`/books/${chapter.bookId}/chapters/${chapter.id}`}>{chapter.chapterNumber} - {chapter.title}</Link>}>
                </List.Item.Meta>
            </List.Item>
        );
    }
}

export default withRouter(injectIntl(ChapterCard));

ChapterCard.propTypes = {
    onUpdated: PropTypes.func,
    chapter: PropTypes.object.isRequired,
    card: PropTypes.bool
};