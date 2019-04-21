import React, { Component } from 'react'
import PropTypes from 'prop-types';

export default class EmptyPlaceholder extends Component {

    renderPlaceHolder() {
        const { message, showButton, buttonText, buttonAction } = this.props;
        let button = null;
        if (showButton) {
            button = (
                <button button type="button" className="btn btn-secondary" onClick={buttonAction}>
                    {buttonText}
                </button>
            )
        }

        return (
            <div className="col-md-12">
                <div className="block block-transparent">
                    <div className="block-content">
                        <div className="text-center py-8">
                            <p>
                                <i className="fa fa-3x fa-info"></i>
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

EmptyPlaceholder.propTypes = {
    message: PropTypes.string,
    showButton: PropTypes.bool,
    buttonText: PropTypes.string,
    buttonAction: PropTypes.func
};
