import React from 'react';

class Editor extends React.Component{

   render(){
    return (
    <Editor className="chapterEditor" rows={50}
      onChange={this.props.onChange(e)}
      value={this.props.value} />);
  }
}

export default Editor;
