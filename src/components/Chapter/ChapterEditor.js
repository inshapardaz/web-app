import React, { Component } from 'react'
import { Header, Icon, Modal, Form } from 'semantic-ui-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import ApiService from '../../services/ApiService';
import { error, success} from '../../services/toasts';

class ChapterEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
        saving: false,
        title: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.close = this.close.bind(this);
    this.save = this.save.bind(this);
}

componentDidMount = () => this.setState({ title: this.props.chapter.title});
handleChange = (event) => this.setState({ title: event.target.value });
close = () => this.props.onClose();

async save() {
    this.setState({
        saving: true
    });

    const { createLink, chapter, isAdding } = this.props;

    try {
        chapter.title = this.state.title;

        if (isAdding) {
            await ApiService.post(createLink, chapter);
        } else {
            await ApiService.put(chapter.links.update, chapter);
        }
        
        success(this.props.intl.formatMessage({ id: "chapter.messages.saved" }));
        this.props.onOk();
        this.close();
    }
    catch (e){
        console.error(e);
        error(this.props.intl.formatMessage({ id: "chapter.messages.error.saving" }));
    }
    finally {
        this.setState({
            saving: false
        });
    }

}

render() {
    const { open, isAdding, intl, chapter   } = this.props;
    const { saving, title } = this.state;
    if (!open || !chapter) {
        return null;
    }

    let header = intl.formatMessage({ id: "chapter.editor.header.edit" }, { title: title });
    if (isAdding) {
        header = intl.formatMessage({ id: "chapter.editor.header.add" });
    }

    return (
        <Modal open={true} size='mini' onClose={this.close}
            closeOnEscape={true} closeOnDimmerClick={false} closeIcon={!saving}>
            <Header icon='edit' content={header} />
            <Modal.Content>
                <Form>
                    <Form.Input label={<FormattedMessage id="chapter.editor.fields.name.title" />}
                        placeholder={intl.formatMessage({ id: "chapter.editor.fields.name.title" })}
                        disabled={saving} content="title" value={title} onChange={this.handleChange}
                        error={!title} />

                    <Form.Button fluid type="submit" 
                        onClick={this.save} 
                        loading={saving}
                        disabled={!title}>
                        <Icon name='save' /> <FormattedMessage id="action.save" />
                    </Form.Button>
                </Form>
            </Modal.Content>
        </Modal>
    )
}
}



export default injectIntl(ChapterEditor);
