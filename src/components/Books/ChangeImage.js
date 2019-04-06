import React, { Component } from 'react'
import ApiService from '../../services/ApiService';
import { Icon } from 'semantic-ui-react';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default class ChangeImage extends Component {
  constructor(props) {
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
      catch (e) {
        console.error(e)
        error(this.props.intl.formatMessage({ id: "message.image.upload.error" }));
      }
    }
  }

  render() {
    return (
      <>
        <li key="image" className="tg-twitter" onClick={() => this.uploadRef.current.click()}><i className="fa fa-photo"></i></li>
        <input type="file" ref={this.uploadRef} style={{ display: "none" }} onChange={(e) => this.uploadImage(e.target.files)} />
      </>
    )
  }
}

ChangeImage.propTypes = {
  uploadLink: PropTypes.string,
  onUpdated: PropTypes.func.isRequired
};
