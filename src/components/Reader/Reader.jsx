import React from 'react';
import './style.scss';
import { Spin } from 'antd';
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

class Reader extends React.Component {


  linkClicked(url) {

  }
  render() {
    const {isLoading} = this.props;

    if (isLoading){
      return <Spin className="reader__loading" />
    }

    return (
      <div className="reader">
        <ReactMarkdown source={this.props.contents || ''}
          astPlugins={[parseHtml]}
          linkTarget={this.linkClicked} />
      </div>
    );
  }
}

export default Reader;
