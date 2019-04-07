import React, { Component } from 'react'
import ApiService from '../../services/ApiService';
import { injectIntl, FormattedMessage } from 'react-intl';
import { ErrorPlaceholder, EmptyPlaceholder, Loading } from '../Common';
import { List, Segment, Button, Icon } from 'semantic-ui-react';
import ChapterEditor from './ChapterEditor';
import ChapterCard from './ChapterCard';
import { isatty } from 'tty';

class ChapterList extends Component {
    constructor(props){
        super(props);
        this.state = {
            isError : false,
            isLoading: false,
            chapters : {}
        };

        this.loadChapters = this.loadChapters.bind(this);
    }

    async componentDidMount() {
        await this.loadChapters();
    }

    async componentWillReceiveProps() {
        await this.loadChapters();
    }

    async loadChapters(){
        const { book } = this.props;
        if (book) {
            this.setState({
                isLoading: true
            });

            try {
                var chapters = await ApiService.getBookChapters(book);
                this.setState({
                    isError : false,
                    isLoading: false,
                    chapters : chapters
                })
            }
            catch(e) {
                console.error(e);
                this.setState({
                    isError : true,
                    isLoading: false
                })
            }

        }
    }

    onAddChapter = () => this.setState({ isAdding : true})
    onCloseEdit = () => this.setState({ isAdding : false})

    renderLoadingError() {
        const { intl } = this.props;
        const message = intl.formatMessage({ id: 'chapters.messages.error.loading' });
        const buttonText = intl.formatMessage({ id: 'action.retry' });
        return (<ErrorPlaceholder message={message}
            showButton={true} buttonText={buttonText}
            buttonAction={this.loadChapters.bind(this)} />)
    }

    renderEmptyPlaceHolder(createLink) {
        const { intl } = this.props;
        const message = intl.formatMessage({ id: 'chapters.messages.empty' });
        const buttonText = intl.formatMessage({ id: 'chapter.action.create' });

        return (
            <>
                {createLink ? this.renderEditor(createLink) : null}
                <EmptyPlaceholder message={message} iconName='file alternate outline'
                    showButton={true} buttonText={buttonText}
                    buttonAction={this.onAddChapter.bind(this)} />
            </>
        );
    }

    renderEditor(createLink) {
        const { isAdding } = this.state;
        return (<ChapterEditor open={isAdding} chapter={{}}
            createLink={createLink} isAdding={isAdding}
            onOk={this.loadChapters.bind(this)}
            onClose={this.onCloseEdit.bind(this)} />);
    }

    renderChapters = (chapters) => chapters.items.map(c => 
        <ChapterCard key={c.id} chapter={c} onUpdate={this.loadChapters} />)


    render() {
        const { isLoading, isError, chapters } = this.state;
        const createLink = (chapters && chapters.links) ? chapters.links.create : null;

        if (isLoading) {
            return <Loading fullWidth={true} />;
        }

        if (isError) {
            return this.renderLoadingError();
        }

        if (!chapters) {
            return null;
        }

        if (chapters && chapters.items && chapters.items.length > 0) {
            let addButton = null;
            if (createLink) {
            addButton = (
                    <Button onClick={this.onAddChapter} icon attached='top' ><Icon name='add' />
                        <FormattedMessage id="chapter.action.create" />
                    </Button>);
            }

            return (
                <>
                    {addButton}
                    <Segment padded={true} attached>
                        <List divided verticalAlign='middle'>{this.renderChapters(chapters)} </List>
                    </Segment>
                    {this.renderEditor(createLink)}
                </>
            )
        } else {
            return this.renderEmptyPlaceHolder(createLink);
        }
    }
}
export default injectIntl(ChapterList);