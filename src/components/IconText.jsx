import React from 'react';
import {Icon} from 'antd';
class IconText  extends React.Component
{
  render()
  {
    const {text, type} = this.props;
    return (<span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
    </span>);
  }
}

export default IconText;
