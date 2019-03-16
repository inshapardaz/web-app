import React, { Component } from 'react'
import { Header, Icon, Modal, Form, TextArea } from 'semantic-ui-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import ApiService from '../../services/ApiService';
import { error, success} from '../../services/toasts';
import AuthorsDropDown from '../Authors/AuthorsDropDown';
import LanguageDropDown from '../LanguageDropDown';
import CategoriesDropDown from '../CategoriesDropDown';
import SeriesDropDown from '../Series/SeriesDropDown';

class BookEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saving: false,
            title: "",
            description: "",
            authorId: null,
            isPublic: false,
            language: 0,
            categories: [],
            seriesId : null,
            seriesIndex : null
        };

        this.handleChange = this.handleChange.bind(this);
        this.handlerAuthorChange = this.handlerAuthorChange.bind(this);
        this.handlerLanguageChange = this.handlerLanguageChange.bind(this);
        this.handlerCategoriesChange = this.handlerCategoriesChange.bind(this);
        this.handlerSeriesChange = this.handlerSeriesChange.bind(this);
        this.handlerPublicChange = this.handlerPublicChange.bind(this);
        this.close = this.close.bind(this);
        this.save = this.save.bind(this);
    }

    componentDidMount(){
        if (this.props.book){
            this.setState({
                title: this.props.book.title,
                description: this.props.book.description,
                language: this.props.book.language,
                categories: this.props.book.categories,
                isPublic : this.props.book.isPublic,
                seriesId: this.props.book.seriesId,
                seriesIndex: this.props.book.seriesIndex
            });
        } 

        if (this.props.authorId){
            this.setState({
                authorId: this.props.authorId
            });
        }

        if (this.props.seriesId){
            this.setState({
                seriesId: this.props.seriesId
            });
        }
    }

    handleChange = (event) => this.setState({ [event.target.name]: event.target.value });

    handlerAuthorChange = (value) => this.setState({ authorId : value});

    handlerLanguageChange = (value) => this.setState({ language : value});

    handlerCategoriesChange = (value) => this.setState({ categories : value});

    handlerSeriesChange = (value) => this.setState({ seriesId : value});

    handlerPublicChange = () => this.setState({ isPublic: !this.state.isPublic })

    close = () => this.props.onClose(); 

    async save() {
        this.setState({
            saving: true
        });

        const { createLink, book, isAdding } = this.props;

        try {
            book.title = this.state.title;
            book.description = this.state.description;
            book.AuthorId = this.state.authorId;
            book.language = this.state.language;
            book.categories = this.state.categories;
            book.isPublic = this.state.isPublic;
            book.seriesId = this.state.seriesId;
            book.seriesIndex = this.state.seriesIndex;

            if (isAdding) {
                await ApiService.post(createLink, book);
            } else {
                await ApiService.put(book.links.update, book);
            }
            
            success(this.props.intl.formatMessage({ id: "books.messages.saved" }));
            this.props.onOk();
            this.close();
        }
        catch{
            error(this.props.intl.formatMessage({ id: "books.messages.error.saving" }));
        }
        finally {
            this.setState({
                saving: false
            });
        }

    }

    render() {
        const { open, isAdding, intl, book } = this.props;
        const { saving, title, description, language, categories, authorId, seriesId, seriesIndex } = this.state;
        if (!open || !book) {
            return null;
        }

        let header = intl.formatMessage({ id: "book.editor.header.edit" }, { title: title });
        if (isAdding) {
            header = intl.formatMessage({ id: "book.editor.header.add" });
        }

        return (
            <Modal open={open} size='small' onClose={this.close} 
                closeOnEscape={true} closeOnDimmerClick={false} closeIcon={!saving}>
                <Header icon='edit' content={header} />
                <Modal.Content>
                    <Form>
                        <Form.Input label={<FormattedMessage id="book.editor.fields.name.title" />}
                            placeholder={intl.formatMessage({ id: "book.editor.fields.name.title" })}
                            disabled={saving} name="title" value={title} onChange={this.handleChange}
                            error={!title} />
                        <Form.TextArea label={<FormattedMessage id="book.editor.fields.description.title" />}
                            placeholder={intl.formatMessage({ id: "book.editor.fields.description.title" })}
                            disabled={saving} name="description" value={description} onChange={this.handleChange}
                            error={!description}/>
                        <Form.Field>
                            <label><FormattedMessage id="book.editor.fields.author.title"/></label>
                            <AuthorsDropDown 
                                placeholder={intl.formatMessage({ id: "book.editor.fields.author.title" })}
                                disabled={saving} name="authorId" value={authorId} onChange={this.handlerAuthorChange}
                                error={!authorId}/>
                        </Form.Field>

                        <Form.Group>
                            <Form.Field width={10}>
                                <label><FormattedMessage id="book.editor.fields.language.title"/></label>
                                <LanguageDropDown 
                                    placeholder={intl.formatMessage({ id: "book.editor.fields.language.title" })}
                                    disabled={saving} name="language" value={language} onChange={this.handlerLanguageChange}
                                    error={language==0}/>
                            </Form.Field>

                            <Form.Field>
                                <label><FormattedMessage id="book.editor.fields.public"/></label>
                                <Form.Checkbox width={6} toggle 
                                    disabled={saving} checked={this.state.isPublic} onChange={this.handlerPublicChange}/>
                            </Form.Field>
                        </Form.Group>

                        <Form.Field >
                            <label><FormattedMessage id="book.editor.fields.categories.title"/></label>
                            <CategoriesDropDown
                                placeholder={intl.formatMessage({ id: "book.editor.fields.categories.title" })}
                                disabled={saving} name="categories" value={categories} onChange={this.handlerCategoriesChange}/>
                        </Form.Field>

                        <Form.Group>
                            <Form.Field width={10}>
                                <label><FormattedMessage id="book.editor.fields.series.title"/></label>
                                <SeriesDropDown 
                                    placeholder={intl.formatMessage({ id: "book.editor.fields.series.title" })}
                                    disabled={saving} name="seriesId" value={seriesId} onChange={this.handlerSeriesChange}/>
                            </Form.Field>

                            <Form.Input type="number" min="1" max="500" width={6} label={<FormattedMessage id="book.editor.fields.seriesIndex.title"/>}
                                placeholder={intl.formatMessage({ id: "book.editor.fields.seriesIndex.title" })}
                                disabled={saving} name="seriesIndex" value={seriesIndex} onChange={this.handleChange}
                                error={seriesId && !seriesId} />
                        </Form.Group>
                        
                        <Form.Button fluid type="submit" 
                            onClick={this.save} 
                            loading={saving}
                            disabled={!title || !description || (seriesId && !seriesId)}>
                            <Icon name='save' /> <FormattedMessage id="action.save" />
                        </Form.Button> 
                    </Form>
                </Modal.Content>
            </Modal>
        )
    }
}


export default injectIntl(BookEditor);