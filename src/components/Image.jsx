import React from 'react';
import PropTypes from "prop-types";
import rel from '../utils/rel';

class Image extends React.Component
{
  onError(e)
  {
    e.target.onerror = null;
    if (this.props.fallback)
    {
      e.target.src= this.props.fallback;
    }
  }
  render() {
    if (this.props.source)
    {
      const imageUrl = rel(this.props.source.links, 'image');
      return <img src={imageUrl} onError={this.onError.bind(this)}/>;
    }

    return (
    <div style={{height: this.props.height | '200px', width:this.props.width | '200px' ,align: 'center'}}>
      Loading...
    </div>);
  }
}

Image.propTypes = {
  source : PropTypes.object,
  fallback: PropTypes.object
}

export default Image;
