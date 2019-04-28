import React, { Component } from 'react'
import { connect } from 'react-redux';
import Loading from '../Common/Loading';

const ReactMarkdown = require('react-markdown')
const htmlParser = require('react-markdown/plugins/html-parser')
var HtmlToReact = require('html-to-react');

//var HtmlToReactParser = require('html-to-react').Parser;


var processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);
const parseHtml = htmlParser({
  isValidNode: node => node.type !== 'script',
  processingInstructions: [{
    shouldProcessNode: function (node) {
      return node.parent && node.parent.name && node.parent.name === 'p';
    },
    processNode: function (node, children) {
      return node.data.toUpperCase();
    }
  }, {
    // Anything else
    shouldProcessNode: function (node) {
      return true;
    },
    processNode: processNodeDefinitions.processDefaultNode
  }]
})

const InlineStyle = ({ font, size }) => (
  <style>{`
        .reader
        {
            direction: rtl;
            text-align: initial;
        }

        .reader > blockquote
        {
            text-align: center;
        }
        
        .reader > blockquote > p
        {
          text-align: center;
        }
      
        .reader > p 
        {
            text-align: justify;
            line-height: 2.0;
        }
            
        .reader > h1,
        .reader > h2,
        .reader > h3,
        .reader > h4,
        .reader > h5,
        .reader > h6,
        .reader > span,
        .reader > a, 
        .reader > p 
        {
            font-weight: initial;
            text-align: right;
            font-family: '${font}' !important;
            font-size: ${size} !important
        }
            
        .reader__loading{
            display: block;
            text-align: center;
        }
    `}</style>
)

class Reader extends Component {
  linkClicked(url) {
  }

  render() {
    const { isLoading, font, fontSize } = this.props;

    if (isLoading) {
      return <Loading fullWidth={true} />
    }
          
    return (
      <>
        <InlineStyle font={font} size={fontSize} />
        <ReactMarkdown source={this.props.contents || ''}
          astPlugins={[parseHtml]} className="reader"
          linkTarget={this.linkClicked} />
      </>
    );
  }
}


export default (connect(
  (state) => ({
    font: state.uiReducer.font,
    fontSize: state.uiReducer.fontSize,
    theme: state.uiReducer.theme
  }), null
)(Reader));
