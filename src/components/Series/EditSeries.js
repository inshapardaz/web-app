import React, { Component } from 'react'
import { Header, Icon, Modal, Form } from 'semantic-ui-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import ApiService from '../../services/ApiService';
import { error, success} from '../../services/toasts';

class EditSeries extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saving: false,
            name: "",
            description: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.close = this.close.bind(this);
        this.save = this.save.bind(this);
    }

    componentDidMount(){
        this.setState({
            name : this.props.series.name,
            description: this.props.series.description
        });
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    close() {
        this.props.onClose();
    }

    async save() {
        this.setState({
            saving: true
        });

        const { createLink, series, isAdding } = this.props;

        try {
            series.name = this.state.name;
            series.description = this.state.description

            if (isAdding) {
                await ApiService.post(createLink, series);
            } else {
                await ApiService.put(series.links.delete, series);
            }
            
            success(this.props.intl.formatMessage({ id: "series.messages.saved" }));
            this.props.onOk();
            this.close();
        }
        catch{
            error(this.props.intl.formatMessage({ id: "series.messages.error.saving" }));
        }
        finally {
            this.setState({
                saving: false
            });
        }

    }

    render() {
        const { open, isAdding, intl, series   } = this.props;
        const { saving, name, description } = this.state;
        if (!open || !series) {
            return null;
        }

        let header = intl.formatMessage({ id: "series.editor.header.edit" }, { name: name });
        if (isAdding) {
            header = intl.formatMessage({ id: "series.editor.header.add" });
        }

        return (
            <Modal open={open} size='small' onClose={this.close}
                closeOnEscape={true} closeOnDimmerClick={false} closeIcon={!saving}>
                <Header icon='edit' content={header} />
                <Modal.Content>
                    <Form>
                        <Form.Input label={<FormattedMessage id="series.editor.fields.name.title" />}
                            placeholder={intl.formatMessage({ id: "series.editor.fields.name.title" })}
                            disabled={saving} name="name" value={name} onChange={this.handleChange}
                            error={!name} />
                        <Form.TextArea label={<FormattedMessage id="series.editor.fields.description.title" />}
                            placeholder={intl.formatMessage({ id: "series.editor.fields.description.title" })}
                            disabled={saving} name="description" value={description} onChange={this.handleChange} />

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


export default injectIntl(EditSeries);