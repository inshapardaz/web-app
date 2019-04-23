import React, { Component } from 'react'
import ApiService from '../../services/ApiService';
import { injectIntl, FormattedMessage } from 'react-intl';
import { ErrorPlaceholder, EmptyPlaceholder, Loading } from '../Common';
import ChapterEditor from './ChapterEditor';
import ChapterCard from './ChapterCard';

class ChapterList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isError: false,
            isLoading: false,
            chapters: {}
        };

        this.loadChapters = this.loadChapters.bind(this);
    }

    async componentDidMount() {
        await this.loadChapters();
    }

    async componentWillReceiveProps() {
        await this.loadChapters();
    }

    async loadChapters() {
        const { book } = this.props;
        if (book) {
            this.setState({
                isLoading: true
            });

            try {
                var chapters = await ApiService.getBookChapters(book);
                this.setState({
                    isError: false,
                    isLoading: false,
                    chapters: chapters
                })
            }
            catch (e) {
                console.error(e);
                this.setState({
                    isError: true,
                    isLoading: false
                })
            }

        }
    }

    onAddChapter = () => this.setState({ isAdding: true })
    onCloseEdit = () => this.setState({ isAdding: false })

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

    renderChapters = (chapters, hideAction = false) => chapters.items.map(c =>
            <ChapterCard key={c.id} chapter={c} onUpdate={this.loadChapters} hideActions={hideAction} />)


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
                addButton = (<button type="button" className="btn-block-option" onClick={this.onAddChapter} href="javascript:void(0);"><i className="si si-plus" /> <FormattedMessage id="chapter.action.create" /></button>);
            }

            if (this.props.simple) {
                return (
                    <>
                        <table className="table table-hover table-vcenter font-size-sm">
                            <tbody>
                                {this.renderChapters(chapters, true)}
                            </tbody>
                        </table>
                    </>
                )
            }
            return (
                <>
                    <div className="block  block-transparent">
                        <div className="block-header">
                            <FormattedMessage id="chapter.toolbar.chapters" />
                            <div className="block-options">
                                {addButton}
                            </div>
                        </div>
                        <div className="block-content">
                            <table className="table table-hover table-vcenter font-size-sm">
                                <tbody>
                                    {this.renderChapters(chapters)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {this.renderEditor(createLink)}
                </>
            )
        } else {
            return this.renderEmptyPlaceHolder(createLink);
        }
    }
}
export default injectIntl(ChapterList);