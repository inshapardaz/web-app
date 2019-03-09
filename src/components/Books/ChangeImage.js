import React, { Component } from 'react'
import ApiService from '../../services/ApiService';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export default class ChangeImage extends Component {
    constructor(props){
        super(props);
        this.uploadRef = React.createRef();
    }

    async uploadImage(files) {
        const { uploadLink } = this.props;
        if (uploadLink && files && files.length) {
          try {
            await ApiService.upload(uploadLink, files[0]);
            this.props.onUpdated();
          }
          catch (e){
            console.error('e', e)
            error(this.props.intl.formatMessage({ id: "message.image.upload.error" }));
          }
        }
      }

  render() {
    return (
      <>
        <Button color={this.props.color} 
                onClick={() => this.uploadRef.current.click()} 
                inverted={this.props.inverted} 
                icon={this.props.icon}
                fluid={this.props.fluid}
                content={this.props.content} />
        <input type="file" ref={this.uploadRef} style={{ display: "none" }} onChange={(e) => this.uploadImage(e.target.files)} />
      </>
    )
  }
}

ChangeImage.propTypes = {
    uploadLink: PropTypes.string,
    color: PropTypes.string,
    onUpdated: PropTypes.func.isRequired,
    inverted: PropTypes.bool,
    icon: PropTypes.string,
    fluid: PropTypes.bool,
    content: PropTypes.object
};
