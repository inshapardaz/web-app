import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { notification, Button } from 'antd';
import { PictureOutlined } from '@ant-design/icons';

import ApiService from '../../services/ApiService';

class UploadBookImage extends Component {
  constructor(props) {
    super(props);
    this.uploadRef = React.createRef();
  }

  async uploadImage(files) {
    const { book } = this.props;

    if (book.links.image_upload && files && files.length) {
      try {
        await ApiService.upload(book.links.image_upload, files[0]);
        notification.success({
          message: this.props.intl.formatMessage({ id: "books.messages.saved" }),
        });
        await this.props.onUpdated();
      }
      catch(e){
        notification.error({
          message: this.props.intl.formatMessage({ id: "books.messages.error.saving" }),
        });
      }
    }
  }

  onClick = () =>  this.uploadRef.current.click()

  render() {
    const action = this.props.button ?
            <Button icon={<PictureOutlined />} block={this.props.block} onClick={this.onClick} >{this.props.intl.formatMessage({ id: 'action.changeImage' })}</Button> :
            <PictureOutlined onClick={this.onClick} />

    return <>
      {action}
      <input type="file" ref={this.uploadRef} style={{ display: "none" }} onChange={(e) => this.uploadImage(e.target.files)} />
    </>
  }
}

export default injectIntl(UploadBookImage);

UploadBookImage.propTypes = {
  onUpdated: PropTypes.func,
  book: PropTypes.object.isRequired,
  button: PropTypes.bool,
  block: PropTypes.bool
};
