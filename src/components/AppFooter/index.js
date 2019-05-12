import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Layout } from 'antd';

const { Footer } = Layout;

export default class AppFooter extends Component {
    render() {
        return (
            <Footer style={{ textAlign: 'center' }}>
                <>
                    <Link to="/">
                        <FormattedMessage id="app" />
                    </Link> &copy; <span data-toggle="year-copy" />
                    <a href='https://github.com/inshapardaz'>
                        <img src="/resources/img/GitHub-Mark-32px.png" />
                    </a>
                </>
            </Footer>
        )
    }
}