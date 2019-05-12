import React, { Component } from 'react'
import { Modal, Button } from 'antd';

export default class Note extends Component {
    info = () => {
        Modal.info({
            icon : null,
            content: this.props.children,
            onOk() { },
        });
    }
    render() {
        return (<Button type="dashed" size="small" onClick={this.info}><i className="far fa-sticky-note" /></Button>);
    }
}
