import React, { Component } from 'react'
import ApiService from '../../services/ApiService';
import { injectIntl, FormattedMessage } from 'react-intl';
import { ErrorPlaceholder, EmptyPlaceholder, Loading } from '../Common';

class ChapterList extends Component {
    constructor(props){
        super(props);
        this.state = {
            isError : false,
            isLoading: false,
            chapters : []
        };
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

        } else {
            console.log('No book to load chapters for', this.props);
        }
    }

    onAddChapter = () => {}

    renderLoadingError() {
        const { intl } = this.props;
        const message = intl.formatMessage({ id: 'chapters.messages.error.loading' });
        const buttonText = intl.formatMessage({ id: 'action.retry' });
        return (<ErrorPlaceholder message={message}
            showButton={true} buttonText={buttonText}
            buttonAction={this.loadChapters.bind(this)} />)
    }

    renderEmptyPlaceHolder() {
        const { intl } = this.props;
        const message = intl.formatMessage({ id: 'chapters.messages.empty' });
        const buttonText = intl.formatMessage({ id: 'chapter.action.create' });

        return (
            <EmptyPlaceholder message={message} iconName='file alternate outline'
                showButton={true} buttonText={buttonText}
                buttonAction={this.onAddChapter.bind(this)} />
        );
    }


    render() {
        const { isLoading, isError, chapters } = this.state;

        if (isLoading) {
            return <Loading />;
        }

        if (isError) {
            return this.renderLoadingError();
        }

        if (!chapters) {
            return null;
        }

        if (chapters && chapters.data && chapters.data.length > 0) {
            return (
                <div>

                </div>
            )
        } else {
            return this.renderEmptyPlaceHolder();
        }
    }
}
export default injectIntl(ChapterList);