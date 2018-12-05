import React from 'react';
import { Icon } from 'antd';
import IconText from '../IconText.jsx';

class WordGender extends React.Component
{

  match = (attributes, value) => attributes && value === value;
  isMale = (attrib ) => this.match(attrib, 0x0000000000000001);
  isFeMale = (attrib ) => this.match(attrib, 0x0000000000000010);

  getGender(attributes)
  {
    var isMale = this.isMale;
    var isFeMale = this.isFeMale;

    if (isMale && isFeMale)
      return (<div key="gender" className="icons-list">
                <Icon type="man" />
                <Icon type="woman" />
              </div>);

    if (isMale)
    {
      return <IconText key="gender" type="man" />;
    }

    if (isFeMale)
    {
      return <IconText key="gender" type="woman" />;
    }

    return null;
  }

  render()
  {
    return this.getGender(this.props.attributes);
  }
}

export default WordGender;
