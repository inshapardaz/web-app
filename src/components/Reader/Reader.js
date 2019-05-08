import React, { Component } from 'react'
import { connect } from 'react-redux';
import Loading from '../Common/Loading';

import MarkdownViewer from './MarkdownViewer';

const InlineStyle = ({ font, size }) => (
  <style>{`
        .reader
        {
            direction: rtl;
            text-align: justify;
            max-width: 844px;
            margin: 0 auto;
            padding: 10px;
            color : black;
            font-size: ${size} !important;
            text-rendering: unset;
            font-weight: initial;
            text-rendering: auto;
        }

        .reader > blockquote
        {
            text-align: center;
        }
        
        .reader > blockquote > div
        {
          text-align: center;
        }
      
        .reader > div
        {
            line-height: 2.0;
        }

        .reader > blockquote
        {
          margin-top: 1em;
        }
        
        .reader > h1,
        .reader > h2,
        .reader > h3,
        .reader > h4,
        .reader > h5,
        .reader > h6,
        .reader > span,
        .reader > a, 
        .reader > div,
        .reader > blockquote,
        .reader > blockquote > *,
        .reader > section > ol > li > div
        {
            font-family: '${font}' !important;
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
        <MarkdownViewer className="reader" source={this.props.contents || ''} />
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

