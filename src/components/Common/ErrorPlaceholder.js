import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Empty, Card, Button } from 'antd';

export default class ErrorPlaceholder extends Component {

    renderPlaceHolder() {
        const { message, showButton, buttonText, buttonAction } = this.props;
        let button = null;
        if (showButton) {
            button = (
                <Button type="default" className="btn btn-secondary" onClick={buttonAction}>
                    {buttonText}
                </Button>
            )   
        } 

        return <Empty image='/resources/error_circle.png' description={this.props.description||''} >{button}{this.props.children}</Empty>;
    }

    render() {
        if (this.props.fullWidth) {
            return (
                <Card>
                        {this.renderPlaceHolder()}
                </Card>);
        }
        else {
            return this.renderPlaceHolder();
        }
    }
}

ErrorPlaceholder.propTypes = {
    message: PropTypes.string,
    showButton: PropTypes.bool,
    buttonText: PropTypes.string,
    buttonAction: PropTypes.func,
    icon: PropTypes.string
};
