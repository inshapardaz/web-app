import React, { Component } from 'react'
import { Header, Icon, Modal, Form } from 'semantic-ui-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import ApiService from '../../services/ApiService';
import { error, success} from '../../services/toasts';

class EditCategory extends Component {
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

    componentDidMount(){
        this.setState({
            name : this.props.category.name
        });
    }

    handleChange(event) {
        this.setState({ name: event.target.value });
    }

    close() {
        this.props.onClose();
    }

    async save() {
        this.setState({
            saving: true
        });

        const { createLink, category, isAdding } = this.props;

        try {
            category.name = this.state.name;

            if (isAdding) {
                await ApiService.post(createLink, category);
            } else {
                await ApiService.put(category.links.delete, category);
            }
            
            success(this.props.intl.formatMessage({ id: "categories.messages.saved" }));
            this.props.onOk();
            this.close();
        }
        catch{
            error(this.props.intl.formatMessage({ id: "categories.messages.error.saving" }));
        }
        finally {
            this.setState({
                saving: false
            });
        }

    }

    render() {
        const { open, isAdding, intl, category   } = this.props;
        const { saving, name } = this.state;
        if (!open || !category) {
            return null;
        }

        let header = intl.formatMessage({ id: "category.editor.header.edit" }, { name: name });
        if (isAdding) {
            header = intl.formatMessage({ id: "category.editor.header.add" });
        }

        return (
            <Modal open={open} size='mini' onClose={this.close}
                closeOnEscape={true} closeOnDimmerClick={false} closeIcon={!saving}>
                <Header icon='edit' content={header} />
                <Modal.Content>
                    <Form>
                        <Form.Input label={<FormattedMessage id="category.editor.fields.name.title" />}
                            placeholder={intl.formatMessage({ id: "category.editor.fields.name.title" })}
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


export default injectIntl(EditCategory);