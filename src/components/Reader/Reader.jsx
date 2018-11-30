import React from 'react';
import './style.scss';
const ReactMarkdown = require('react-markdown')


class Reader extends React.Component
{
  linkClicked(url)
  {
    console.log(url);
  }
  render()
  {
    return (
      <div className="reader">
        <ReactMarkdown source={this.props.contents || ''}
              linkTarget={this.linkClicked} />
      </div>
    );
  }
}

export default Reader;
