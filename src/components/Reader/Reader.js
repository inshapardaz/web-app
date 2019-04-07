import React, { Component } from 'react'
import Loading from '../Common/Loading';
import {Container} from 'semantic-ui-react'
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

const InlineStyle = () => (
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
        .reader > h5 {
            font-weight: bold;
            font-size: 1.5em;
            text-align: right;
            font-family: inherit;
        }
            
        .reader__loading{
            display: block;
            text-align: center;
        }
    `}</style>
  )

export default class Reader extends Component {
    linkClicked(url) {
    }

    render() {
      const {isLoading} = this.props;
  
      if (isLoading){
        return <Loading fullWidth={true} />
      }
  
      return (
        <Container >
            <InlineStyle />
          <ReactMarkdown source={this.props.contents || ''}
            astPlugins={[parseHtml]} className="reader"
            linkTarget={this.linkClicked} />
        </Container>
      );
    }
}
