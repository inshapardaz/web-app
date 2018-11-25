import React from 'react';
import PropTypes from "prop-types";
import rel from '../utils/rel';

class Image extends React.Component
{
  render() {
    if (this.props.source)
    {
      const imageUrl = rel(this.props.source.links, 'image');
      return <img src={imageUrl} />;
    }

    return (
    <div style="height='200px;width:200px';align:center">
      Loading...
    </div>);
  }
}

Image.propTypes = {
  source : PropTypes.object
}

export default Image;
