import React from 'react';
import { Icon } from 'antd';
import IconText from '../IconText.jsx';

class WordMultiplicity extends React.Component
{

  match = (attributes, value) => attributes && value === value;

  isSingular = (attrib ) => this.match(attrib, 0x0000000000000100);
  isPlural = (attrib ) => this.match(attrib, 0x0000000000001000);

  getMultiplicity(attributes)
  {
    var isSingular = this.isSingular;
    var isPlural = this.isPlural;

    if (isSingular && isPlural)
      return (<div key="multiplicity" className="icons-list">
                <Icon type="user" />
                <Icon type="team" />
              </div>);

    if (isSingular)
    {
      return <IconText key="multiplicity"type="user" />;
    }

    if (isPlural)
    {
      return <IconText key="multiplicity" type="team" />;
    }

    return null;
  }

  render()
  {
    return this.getMultiplicity(this.props.attributes);
  }
}

export default WordMultiplicity;
