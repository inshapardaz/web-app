import React, { Component } from 'react'
var Remarkable = require('remarkable');
import RemarkableReactRenderer from 'remarkable-react';

export default class MarkdownViewer extends Component {

    getRawMarkup() {
        const md = new Remarkable();
        md.renderer = new RemarkableReactRenderer();

        return md.render(this.props.source);
    }

    render() {
        return (
            <div
                className={this.props.className}
            >{this.getRawMarkup()}</div>
        )
    }
}
