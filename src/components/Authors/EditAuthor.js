import React, { Component } from 'react'
import { Header, Icon, Modal, Form } from 'semantic-ui-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import ApiService from '../../services/ApiService';
import { error, success} from '../../services/toasts';

class EditAuthor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saving: false,
            name: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.close = this.close.bind(this);
        this.save = this.save.bind(this);
    }

    componentDidMount = () => this.setState({name : this.props.author ? this.props.author.name : ''});
    handleChange = (event) => this.setState({ name: event.target.value });
    close = () => this.props.onClose();

    async save() {
        this.setState({
            saving: true
        });

        const { createLink, author, isAdding } = this.props;

        try {
            author.name = this.state.name;

            if (isAdding) {
                await ApiService.post(createLink, author);
            } else {
                await ApiService.put(author.links.update, author);
            }
            
            success(this.props.intl.formatMessage({ id: "authors.messages.saved" }));
            this.props.onOk();
            this.close();
        }
        catch{
            error(this.props.intl.formatMessage({ id: "authors.messages.error.saving" }));
        }
        finally {
            this.setState({
                saving: false
            });
        }

    }

    render() {
        const { open, isAdding, intl, author   } = this.props;
        const { saving, name } = this.state;
        if (!open || !author) {
            return null;
        }

        let header = intl.formatMessage({ id: "author.editor.header.edit" }, { name: name });
        if (isAdding) {
            header = intl.formatMessage({ id: "author.editor.header.add" });
        }

        return (
            <Modal open={open} size='mini' onClose={this.close}
                closeOnEscape={true} closeOnDimmerClick={false} closeIcon={!saving}>
                <Header icon='edit' content={header} />
                <Modal.Content>
                    <Form>
                        <Form.Input label={<FormattedMessage id="author.editor.fields.name.title" />}
                            placeholder={intl.formatMessage({ id: "author.editor.fields.name.title" })}
                            disabled={saving} content="test" value={name} onChange={this.handleChange}
                            error={!name} />

                        <Form.Button fluid type="submit" 
                            onClick={this.save} 
                            loading={saving}
                            disabled={!name}>
                            <Icon name='save' /> <FormattedMessage id="action.save" />
                        </Form.Button>
                    </Form>
                </Modal.Content>
            </Modal>
        )
    }
}


export default injectIntl(EditAuthor);