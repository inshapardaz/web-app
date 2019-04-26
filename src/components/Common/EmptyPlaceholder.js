import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Empty } from 'antd';

export default class EmptyPlaceholder extends Component {

    renderPlaceHolder() {
        const { message, showButton, buttonText, buttonAction } = this.props;
        let button = null;
        if (showButton) {
            button = (
                <button type="button" className="btn btn-secondary" onClick={buttonAction}>
                    {buttonText}
                </button>
            )
        } 

        return <Empty image={this.props.image || Empty.PRESENTED_IMAGE_SIMPLE} description={this.props.description} >{this.props.children}</Empty>;
    }
    render() {
        if (this.props.fullWidth) {
            return (
                <main id="main-container">
                    <div className="row">
                        {this.renderPlaceHolder()}
                    </div>
                </main>);
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
