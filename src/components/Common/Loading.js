import React, { Component } from 'react'
import { Spin, Layout } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 45 }} />;

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
