import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

export default class FontsSizeMenu extends Component {
    state = {
        fontSize : '100%'
    };

    componentWillMount(){
        var fontSize = localStorage.getItem('reader.fontSize');
        if (fontSize){
            this.setState({
                fontSize: fontSize 
            });

            this.props.onFontSizeChanged(fontSize);
        }
    }

    changeFontSize(e, { value }) {
        this.setState({
          fontSize: value
        });
    
        localStorage.setItem('reader.fontSize', value);
        this.props.onFontSizeChanged(value);
      }

    render() {
        var options = [
            {"key":"80", "value": '80%', "text": 'Very Small'},
            {"key":"90", "value": '90%', "text": 'Small'},
            {"key":"100", "value": '100%', "text": 'Medium'},
            {"key":"120", "value": '120%', "text": 'Large'},
            {"key":"150", "value": '150%', "text": 'Very Large'},
            {"key":"170", "value": '170%', "text": 'Huge'}
          ];
      
          var value = this.state.fontSize;
          return (<Dropdown text="Font Size" pointing 
                            className='link item' 
                            onChange={this.changeFontSize.bind(this)} 
                            options={options} 
                            value={value} />);
    }
}

FontsSizeMenu.propTypes = {
    onFontSizeChanged: PropTypes.func.isRequired
};