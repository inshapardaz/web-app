import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { injectIntl } from 'react-intl';

import { PageHeader, Anchor, Button, message, Input } from 'antd';

import { Loading } from '../Common';
import ApiService from '../../services/ApiService';
const { TextArea } = Input;

const Style = () => (<style>
    {`
        .editor {
            padding-left: 50px;
            padding-right: 50px;    
            direction: rtl;         
        }

        .editor .text{
            resize: none;
            outline: none;
            width: 100%;
            border: none;
            height: 100%;
            margin: -10px;
          }
    `}
</style>)
class ChapterContentEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            book : null,
            chapter : null,
            contents: '',
            chapterContents : null,
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
                contents: contents.contents,
                chapterContents : contents
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

    onChangeValue = (e) => {
        const val = e.target.value;
        this.setState({ contents: val });
    }

    onImageUpload = async (file) => {
        var response = await ApiService.upload(this.props.entry.links.image_upload, file);
        console.log
        return response.links.self;
    }

    saveContents = async() => {

        const { chapter, chapterContents, contents} = this.state;
        this.setState({
            saving: true,
        });
        
        const hide = message.loading(this.props.intl.formatMessage({ id: "message.saving" }), 0);

        try{
            const updateLink = chapterContents.links.update;
            const createLink = chapter.links.add_contents;

            if (updateLink){
                await ApiService.post(updateLink, JSON.stringify(contents));
            }
            else if (createLink) {
                await ApiService.put(createLink, JSON.stringify(contents));
            }
            else {
                throw "Invalid operation";
            }
            hide();
            message.success(this.props.intl.formatMessage({ id: "message.saved" }));
            this.setState({
                saving : false
            })
        }
        catch(e){
            console.error(e);
            this.setState({
                saving : false
            })
            hide();
            message.error(this.props.intl.formatMessage({ id: "message.error.saving" }));   
        }
    }

    render() {
        const { book, chapter, contents, saving, isLoading} = this.state;
        if (isLoading) return <Loading />;

        const extra = (<>
            <Button onClick={() => this.props.history.push(`/books/${chapter.bookId}/chapters/${chapter.id}`)}>View</Button>
            <Button onClick={this.saveContents}>Save</Button>
          </>);

        return (
            <>
                <Anchor affix>
                    <PageHeader title={book.title}
                        subTitle={chapter.title}
                        onBack={() => window.history.back()}
                        extra={extra} />
                </Anchor>
                <Style />
                <div className="editor" >
                    {/* uploadImage={this.onImageUpload} */}
                    <TextArea className="text" defaultValue={contents} autosize onChange={this.onChangeValue}/>
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
)(withRouter(injectIntl(ChapterContentEditor))));


ChapterContentEditor.propTypes = {
};