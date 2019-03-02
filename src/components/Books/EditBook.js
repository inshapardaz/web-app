import React, { Component } from 'react'
import { Header, Icon, Modal, Form, TextArea } from 'semantic-ui-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import ApiService from '../../services/ApiService';
import { error, success} from '../../services/toasts';
import AuthorsDropDown from '../Authors/AuthorsDropDown';
import LanguageDropDown from '../LanguageDropDown';
import CategoriesDropDown from '../CategoriesDropDown';

class EditBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saving: false,
            title: "",
            description: "",
            authorId: null,
            language: 0,
            categories: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.handlerAuthorChange = this.handlerAuthorChange.bind(this);
        this.handlerLanguageChange = this.handlerLanguageChange.bind(this);
        this.handlerCategoriesChange = this.handlerCategoriesChange.bind(this);
        this.close = this.close.bind(this);
        this.save = this.save.bind(this);
    }

    componentDidMount(){
        if (this.props.book){
            this.setState({
                title: this.props.book.title,
                description: this.props.book.description,
                language: this.props.book.language,
                categories: this.props.book.categories
            });
        } 

        if (this.props.authorId){
            this.setState({
                authorId: this.props.authorId
            });
        }
    }

    handleChange = (event) => this.setState({ [event.target.name]: event.target.value });

    handlerAuthorChange = (value) => this.setState({ authorId : value});

    handlerLanguageChange = (value) => this.setState({ language : value});

    handlerCategoriesChange = (value) => this.setState({ categories : value});

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
        const { saving, title, description, language, categories, authorId } = this.state;
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

                        <Form.Field >
                            <label><FormattedMessage id="book.editor.fields.language.title"/></label>
                            <LanguageDropDown 
                                placeholder={intl.formatMessage({ id: "book.editor.fields.language.title" })}
                                disabled={saving} name="language" value={language} onChange={this.handlerLanguageChange}
                                error={language==0}/>
                        </Form.Field>


                        {<Form.Field >
                            <label><FormattedMessage id="book.editor.fields.categories.title"/></label>
                            <CategoriesDropDown
                                placeholder={intl.formatMessage({ id: "book.editor.fields.categories.title" })}
                                disabled={saving} name="categories" value={categories} onChange={this.handlerCategoriesChange}/>
                        </Form.Field>}

                        <Form.Button fluid type="submit" 
                            onClick={this.save} 
                            loading={saving}
                            disabled={!title || !description}>
                            <Icon name='save' /> <FormattedMessage id="action.save" />
                        </Form.Button> 
                    </Form>
                </Modal.Content>
            </Modal>
        )
    }
}


export default injectIntl(EditBook);