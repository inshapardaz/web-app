import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Empty, Card, Button } from 'antd';

const cardStyle = {
    marginBottom: "12px"
}

export default class EmptyPlaceholder extends Component {

    renderPlaceHolder() {
        const { message, showButton, buttonText, buttonAction } = this.props;
        let button = null;
        if (showButton) {
            button = (
                <Button type="default" onClick={buttonAction}>
                    {buttonText}
                </Button>
            )
        }

        return <Empty image={this.props.image || Empty.PRESENTED_IMAGE_SIMPLE} description={this.props.description} >{button}{this.props.children}</Empty>;
    }
    render() {
        if (this.props.fullWidth) {
            return (
                <Card style={cardStyle} >
                    {this.renderPlaceHolder()}
                </Card>);
        }
        else {
            return this.renderPlaceHolder();
        }
    }
}

EmptyPlaceholder.propTypes = {
    message: PropTypes.string,
    showButton: PropTypes.bool,
    buttonText: PropTypes.string,
    buttonAction: PropTypes.func
};
