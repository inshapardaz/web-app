import React, { Component } from 'react'
import PropTypes from 'prop-types';

class Image extends Component {
  render() {
    return (
      <div>
        
      </div>
    )
  }
}


export default Image;

ChangeImage.propTypes = {
    url: PropTypes.string.isRequired,
    default: PropTypes.string.isRequired,
    height: PropTypes.number,
    width: PropTypes.number
};
