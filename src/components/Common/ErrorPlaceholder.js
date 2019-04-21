import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Icon, Button, Segment, Header } from 'semantic-ui-react';


export default class ErrorPlaceholder extends Component {
    renderPlaceHolder() {
        const { message, showButton, buttonText, buttonAction, icon } = this.props;
        let button = null;
        if (showButton) {
            button = (
                <button type="button" className="btn btn-secondary" onClick={buttonAction}>
                    {buttonText}
                </button>)
        }

        return (
            <div className="col-md-12">
                <div className="block block-transparent">
                    <div className="block-content">
                        <div className="text-center py-8">
                            <p>
                                <i className="far fa-3x fa-times-circle"></i>
                            </p>
                            <div className="mb-0">{message}</div>
                            <div className="py-4">{button}</div>
                        </div>                        
                     </div>
                </div>
            </div>
        )
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

ErrorPlaceholder.propTypes = {
    message: PropTypes.string,
    showButton: PropTypes.bool,
    buttonText: PropTypes.string,
    buttonAction: PropTypes.func,
    icon: PropTypes.string
};
