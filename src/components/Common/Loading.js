import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl';

export default class Loading extends Component {
    renderLoading() {
        return (
            <div className="col-md-12">
                <div className="block block-transparent block-mode-loading">
                    <div className="block-content">
                        <div className="py-10" />
                     </div>
                </div>
            </div>
        );
    }
    render() {

        if (this.props.fullWidth) {
            return (
            <main id="main-container">
                <div className="row">
                    {this.renderLoading()}
                </div>
            </main>);
        }
        else {
            return this.renderLoading();
        }
    }
}
