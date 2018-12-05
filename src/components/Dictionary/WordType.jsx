import React from 'react';
import { Icon } from 'antd';
import IconText from '../IconText.jsx';

class WordType extends React.Component
{

  match = (attributes, value) => attributes && value === value;
  ism = (attrib ) => this.match(attrib, 0x0000000000010000);
  sift = (attrib ) => this.match(attrib, 0x0000000000020000);
  feal = (attrib ) => this.match(attrib, 0x0000000000030000);
  harf = (attrib ) => this.match(attrib, 0x0000000000040000);

  /*isPlural = (attrib ) => this.match(attrib, 0x0000000000001000);
  isPlural = (attrib ) => this.match(attrib, 0x0000000000001000);
  isPlural = (attrib ) => this.match(attrib, 0x0000000000001000);
  isPlural = (attrib ) => this.match(attrib, 0x0000000000001000);
  isPlural = (attrib ) => this.match(attrib, 0x0000000000001000);
  isPlural = (attrib ) => this.match(attrib, 0x0000000000001000);
  isPlural = (attrib ) => this.match(attrib, 0x0000000000001000);
  isPlural = (attrib ) => this.match(attrib, 0x0000000000001000);
  isPlural = (attrib ) => this.match(attrib, 0x0000000000001000);
  isPlural = (attrib ) => this.match(attrib, 0x0000000000001000);
  isPlural = (attrib ) => this.match(attrib, 0x0000000000001000);
  isPlural = (attrib ) => this.match(attrib, 0x0000000000001000);
  isPlural = (attrib ) => this.match(attrib, 0x0000000000001000);
  isPlural = (attrib ) => this.match(attrib, 0x0000000000001000);
  isPlural = (attrib ) => this.match(attrib, 0x0000000000001000);*/


  getAttribute(attributes)
  {
    let type = "نامعلوم"
    if (this.ism(attributes))
    { type = "اسم" }
    else if (this.sift(attributes))
    { type = "صفت" }
    else if (this.feal(attributes))
    { type = "فعل" }
    else if (this.harf(attributes))
    { type = "حرف" }

    return <IconText key="type" type="profile" text={type} />;
  }

  render()
  {
    return this.getAttribute(this.props.attributes);
  }
}

export default WordType;
