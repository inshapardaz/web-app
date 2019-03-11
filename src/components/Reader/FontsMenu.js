import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Icon } from 'semantic-ui-react';

export default class FontsMenu extends Component {
    state = {
        font : 'Mehr-Nastaleeq'
    };

    componentWillMount(){
        var font = localStorage.getItem('reader.font');
        if (font){
            this.setState({
                font: font 
            });

            this.props.onFontChanged(font);
        }
    }

    changeFont(e, { value }) {
        this.setState({
            font: value
        });
    
        localStorage.setItem('reader.font', value);
        this.props.onFontChanged(value);
      }

    render() {
        var options = [
            {"key":"Jameel Noori Nastaleeq", "value": 'Jameel Noori Nastaleeq', "text": 'جمیل نوری نستعلیق'},
            {"key":"Mehr-Nastaleeq", "value": 'Mehr-Nastaleeq', "text": 'مہر نستعلیق'},
            {"key":"Noto", "value": 'Noto', "text": 'نوٹو'},
            {"key":"Nafees Nastaleeq", "value": 'Nafees Nastaleeq', "text": 'نفیس نستعلیق'},
            {"key":"Nafees Web Naskh", "value": 'Nafees Web Naskh', "text": 'نفیس نسخ'},
            {"key":"AdobeArabic", "value": 'AdobeArabic', "text": 'اڈوبی عربک'},
            {"key":"MehfilNaskh", "value": 'MehfilNaskh', "text": 'محفل نسخ'},
            {"key":"Dubai", "value": 'Dubai', "text": 'دبِی'},
            {"key":"UrduNaskhAsiatype", "value": 'UrduNaskhAsiatype', "text": 'اردو نسخ ایشیا ٹائپ'}
          ];
      
          var value = this.state.font;
          return (<Dropdown icon="font" pointing 
                            className='link item' 
                            onChange={this.changeFont.bind(this)} 
                            options={options} 
                            value={value} />);
    }
}   

FontsMenu.propTypes = {
    onFontChanged: PropTypes.func.isRequired
};