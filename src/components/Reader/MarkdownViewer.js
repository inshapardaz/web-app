import React, { Component } from 'react'
var Remarkable = require('remarkable');
import RemarkableReactRenderer from 'remarkable-react';

class Paragraph extends Component {
    render() {
        return (<div>{this.props.children}</div>)
    }
}
export default class MarkdownViewer extends Component {

    getRawMarkup() {
        const md = new Remarkable({
            breaks: true,
            typographer:  true,
            quotes: '“”‘’'
        });

        md.renderer = new RemarkableReactRenderer({
            remarkableProps : {
            },
            components : {
                p : Paragraph
            }
        });

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
