import React, { Component } from 'react'
import ApiService from '../../services/ApiService';
import { FormattedMessage } from 'react-intl';
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
        {this.props.as && this.props.as == "a" ? 
        <a key="image" className="btn btn-sm btn-light" onClick={() => this.uploadRef.current.click()} href="javascript:void(0);">{this.props.content}</a> :
        <button type="button" key="image" className="btn-block-option" onClick={() => this.uploadRef.current.click()}><i className="far fa-fw fa-image"/></button>}
        <input type="file" ref={this.uploadRef} style={{ display: "none" }} onChange={(e) => this.uploadImage(e.target.files)} />
      </>
    )
  }
}

ChangeImage.propTypes = {
  uploadLink: PropTypes.string,
  onUpdated: PropTypes.func.isRequired
};
