import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl } from 'react-intl';

import { PageHeader, Anchor, Button } from 'antd';

import { ErrorPlaceholder, EmptyPlaceholder, Loading } from '../Common';
import Editor from "rich-markdown-editor";
import ApiService from '../../services/ApiService';

class ChapterContentEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            book : null,
            chapter : null,
            contents: '',
            saving: false,
            isLoading: true,
            isError: false
        }
    }

    async componentDidMount() {
        const {
            match: { params },
        } = this.props

        await this.loadChapter(params.id, params.chapterId);
    }

    async componentWillReceiveProps(nextProps) {
        const {
            match: { params },
        } = nextProps

        await this.loadChapter(params.id, params.chapterId);
    }

    async loadChapter(bookId, chapterId) {
        this.setState({
            bookId: bookId,
            chapterId: chapterId,
            isLoading: true,
        });

        try {
            var book = await ApiService.getBook(bookId);
            var chapter = await ApiService.getChapter(bookId, chapterId);
            var contents = (chapter.links.update_contents)
                ? await ApiService.getChapterContents(bookId, chapterId)
                : { contents : '' };

            this.setState({
                isLoading: false,
                book: book,
                chapter: chapter,
                contents: contents.contents
            });
        }
        catch (e) {
            if (e.response.status == 404) {
                this.setState({
                    isLoading: false,
                    contents: ''
                });
            }
            else {
                this.setState({
                    isLoading: false,
                    isError: true
                });
            }
        }
    }


    handleChange = (event) => {
        const value = event.target.value;
        this.onChangeValue(value);
    }

    onChangeValue = (value) => {
        const val = value();
        this.setState({ contents: val });
    }

    onImageUpload = async (file) => {
        var response = await ApiService.upload(this.props.entry.links.image_upload, file);
        return response.links.self;
    }

    render() {
        const { book, chapter, contents, saving, isLoading} = this.state;
        if (isLoading) return <Loading />;

        const extra = (<>
            <Button>Save</Button>
          </>);

        return (
            <>
                <Anchor affix>
                    <PageHeader title={book.title}
                        subTitle={chapter.title}
                        onBack={() => window.history.back()}
                        extra={extra} />
                </Anchor>
                <div style={{direction: 'rtl'}}>
                    <Editor readOnly={saving} autoFocus={true} toc={true} uploadImage={this.onImageUpload}
                            defaultValue={contents} onChange={this.onChangeValue}/>
                </div>
            </>
        );
    }
}

export default (connect(
    (state) => ({
        entry: state.apiReducers.entry
    }),
    dispatch => bindActionCreators({
    }, dispatch)
)(injectIntl(ChapterContentEditor)));


ChapterContentEditor.propTypes = {
};