import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Header, Icon, Modal, Form } from 'semantic-ui-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import ApiService from '../../services/ApiService';

class EditCategory extends Component {
    constructor(props){
        super(props);
        this.state = {
            saving : false
        };
    }
    close(){
        console.log('closing');
        this.props.onClose();
    }

    save(){
        console.log('ok');
        this.setState({
            saving : true
        });

        const { user, createNew } = this.props;
        const api = new ApiService(user);

        setTimeout(() => {
            this.setState({
                saving : false
            });
            this.close();
        }, 4000)
        
    }

    render() {
        const { open, category, createNew, intl } = this.props;
        const { saving } = this.state;
        if (!open || !category) {
            return null;
        }

        let header = intl.formatMessage({id:"category.editor.header.edit"}, {name : category.name});
        if (createNew){
            category = {};
            header = intl.formatMessage({id:"category.editor.header.add"});
        }

        return (
            <Modal open={open} size='small' onClose={this.close.bind(this)} 
                   closeOnEscape={false} closeOnDimmerClick={false}>
                <Header icon='edit' content={header} />
                <Modal.Content>
                    <Form>
                        <Form.Input label={<FormattedMessage id="category.editor.fields.name.title" />}
                                placeholder={intl.formatMessage({id:"category.editor.fields.name.title"})}
                                disabled={saving} content="test" />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='green' onClick={this.save.bind(this)} loading={saving}>
                        <Icon name='save' /> <FormattedMessage id="action.save"/>
                    </Button>
                    <Button secondary onClick={this.close.bind(this)} loading={saving}>
                        <FormattedMessage id="action.cancel" />
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}


export default connect(
    state => ({
      user: state.oidc.user
    }), dispatch => bindActionCreators({
  
    }))(injectIntl(EditCategory));