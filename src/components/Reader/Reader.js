import React, { Component } from 'react'
import { connect } from 'react-redux';
import Loading from '../Common/Loading';

import MarkdownViewer from './MarkdownViewer';

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
        .reader {
          font-size: ${size} !important
        }
            

        .reader > h1,
        .reader > h2,
        .reader > h3,
        .reader > h4,
        .reader > h5,
        .reader > h6,
        .reader > span,
        .reader > a, 
        .reader > p,
        .reader > blockquote,
        .reader > blockquote > *,
        .reader > section > ol > li > p
        {
            font-weight: initial;
            text-align: right;
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
        <MarkdownViewer className="reader" source={this.props.contents || ''}/>
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

