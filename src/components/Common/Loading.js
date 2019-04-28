import React, { Component } from 'react'
import { Spin, Icon, Layout } from 'antd';

const antIcon = <Icon type="loading" style={{ fontSize: 45 }} spin />;

const Style = () => {
    return (<style>
        {`
            .spinner {
                position: absolute;
                left: 50%;
                top: 50%;
                -webkit-transform: translate(-50%, -50%);
                transform: translate(-50%, -50%);
            }
        `}
    </style>)
}
export default class Loading extends Component {
    render() {
        return (
            <div className="spinner">
                <Style />
                <Spin size="large" indicator={antIcon} wrapperClassName="spinner" />
            </div>
        );
    }
}
