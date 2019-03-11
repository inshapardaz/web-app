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

    onEdit = () => this.setState({showEdit : true });
    onCloseEdit = () => this.setState({showEdit : false });
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
        catch (e){
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
            actions.push(<Button key="edit" onClick={this.onEdit} icon="pencil" />)
        }

        if (chapter.links.delete) {
            actions.push(<Button key="delete" onClick={this.onDelete} icon="delete" />)
        }
        return actions;
    }

    render() {
        const { chapter } = this.props;

        if (!chapter) return null;
        return (
            <>
                <List.Item>
                    <List.Content floated='right'>
                        {this.renderChapterActions(chapter)}
                    </List.Content>
                    <Icon name="file alternate outline" />
                    <List.Content >
                        <Link to={`/books/${chapter.bookId}/chapters/${chapter.id}`}>{chapter.title}</Link>
                    </List.Content>
                </List.Item>
                {this.renderEditor(chapter)}
                {this.renderDelete()}
            </>
        )
    }
}

export default injectIntl(ChapterCard);
