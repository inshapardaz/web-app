import React from 'react';
import IconText from '../IconText.jsx';

class Language extends React.Component {
  getLanguageString(language) {
    switch (language) {
      case 1:
        return "نامعلوم";
      case 2:
        return "اردو";
      case 3:
        return "سنسکرت";
      case 4:
        return "ھندی";
      case 5:
        return "فارسی";
      case 6:
        return "عربی";
      case 7:
        return "ترک";
      case 8:
        return "انگریزی";
      case 9:
        return "فرانسیسی";
      case 10:
        return "پراکرت";
      case 11:
        return "لاطینی";
      case 12:
        return "پنجابی";
      case 13:
        return "یونانی";
      case 14:
        return "عبرانی";
      case 15:
        return "پرتگالی";
      case 16:
        return "اطالوی";
      case 17:
        return "ھسپانوی";
      case 18:
        return "چینی";
      case 19:
        return "جاپانی";
      case 20:
        return "سندھی";
      case 21:
        return "جرمن";
      case 22:
        return "مقامی";
      case 23:
        return "سریانی";
      case 24:
        return "اویستا";
      case 25:
        return "گجراتی";
      case 26:
        return "مرھاٹی";
      case 27:
        return "بنگالی";
      case 28:
        return "پالی";
    }
  }
  render() {
    return (<IconText type="global" text={this.getLanguageString(this.props.language)} />)
  }
}

export default Language;
