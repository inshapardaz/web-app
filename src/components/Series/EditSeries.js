import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { Alert, Modal, Input, Form, Button, notification } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';

import ApiService from '../../services/ApiService';

/*const SeriesForm = Form.create({
    name: 'seriesEditor',
    mapPropsToFields(props) {
        return {
            name: Form.createFormField({
                ...props.name,
                value: props.name || '',
            }),
            description: Form.createFormField({
                ...props.description,
                value: props.description || '',
            })
        };
    }
})(
    class extends React.Component {
        render() {
            const { visible, header, onCancel, onOK, isError, isBusy, form, intl } = this.props;
            const { getFieldDecorator } = form;

            return (
                <Modal
                    title={header}
                    visible={visible}
                    onOk={onOK}
                    confirmLoading={isBusy}
                    onCancel={onCancel}
                    closeIcon={!isBusy}
                    closeOnEscape={true}
                    maskClosable={false}>
                    <Form layout="vertical">
                        <Form.Item label={intl.formatMessage({ id: "series.editor.fields.name.title" })} >
                            {getFieldDecorator('name', {
                                rules: [{
                                    required: true, message: intl.formatMessage({ id: 'series.editor.fields.name.error' }),
                                }],
                            })(
                                <Input />
                            )}
                        </Form.Item>

                        <Form.Item label={intl.formatMessage({ id: "series.editor.fields.description.title" })} >
                            {getFieldDecorator('description', {})(
                                <Input />
                            )}
                        </Form.Item>
                    </Form>
                    {isError ? <Alert message={intl.formatMessage({ id: 'series.messages.error.saving' })} type="error" showIcon /> : null}
                </Modal>
            );
        }
    }
);*/

class EditSeries extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            isBusy: false,
            isError: false
        };
    }

    onOpen = () => {
        this.setState({ visible: true });
    }

    onClose = () => {
        if (this.formRef) {
            const form = this.formRef.props.form;
            form.resetFields();
        }
        this.setState({ visible: false, isError: false });
    }

    onSave = async () => {
        const form = this.formRef.props.form;

        await form.validateFields(async (err, values) => {
            if (err) {
                return;
            }

            await this.saveSeries(values);
        });
    }

    saveSeries = async (values) => {
        this.setState({
            isBusy: true,
            isError: false
        });

        let { createLink, series, isAdding } = this.props;

        try {

            if (isAdding && series == null){
                series = { name: '', description: ''}
            } 

            series.name = values.name;
            series.description = values.description

            if (isAdding) {
                await ApiService.post(createLink, series);
            } else {
                await ApiService.put(series.links.update, series);
            }

            notification.success({
                message: this.props.intl.formatMessage({ id: "series.messages.saved" }),
            });

            this.props.onUpdated();
            this.onClose();
        }
        catch(e){
            console.error(e)
            this.setState({
                isError: true
            });
        }
        finally {
            this.setState({
                isBusy: false
            });
        }
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    render() {
        const { isAdding, intl, series, button } = this.props;
        const { isBusy, isError, visible } = this.state;

        let header = intl.formatMessage({ id: "series.editor.header.add" });
        let buttonText = intl.formatMessage({ id : "series.action.create"});
        let icon = <PlusOutlined onClick={this.onOpen}/>;

        if (!isAdding && series) {
            header = intl.formatMessage({ id: "series.editor.header.edit" }, { name: series.name });
            buttonText = intl.formatMessage({ id : "action.edit"});
            icon = <EditOutlined onClick={this.onOpen}/>;
        }

        const action = button ? 
         <Button icon={icon} onClick={this.onOpen} >{buttonText}</Button> : 
         icon;
        return null;
        /*return (
            <>
                {action}
                <SeriesForm {...series}
                    wrappedComponentRef={this.saveFormRef}
                    visible={visible}
                    header={header}
                    isBusy={isBusy}
                    isError={isError}
                    onCancel={this.onClose}
                    onOK={this.onSave}
                    intl={intl}
                />
            </>
        )*/
    }
}


export default injectIntl(EditSeries);

EditSeries.propTypes = {
    onUpdated: PropTypes.func,
    series: PropTypes.object 
};
