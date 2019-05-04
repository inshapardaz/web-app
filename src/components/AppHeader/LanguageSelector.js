import React, { Component } from 'react'
import { Menu, Dropdown } from 'antd'
import LocaleService from '../../services/LocaleService';

const Styles = () => (<style>
    {`
    .dropdown {
        padding-right: 15px;
        position: relative;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
    }

    .dropdown::after {
        color: #d2d9e5;
        position: absolute;
        top: 50%;
        right: 0;
        margin-top: -2px;
        display: inline-block;
        width: 0;
        height: 0;
        margin-left: 0.255em;
        vertical-align: 0.255em;
        content: '';
        border-top: 0.3em solid;
        border-right: 0.3em solid transparent;
        border-bottom: 0;
        border-left: 0.3em solid transparent;
        transition: all 0.2s ease-in-out;
    }
      
    .dropdown:hover {
          color: #08f;
    }
    .dropdown:hover::after {
        color: #b8beca;
    }
      
    .dropdown:global .anticon {
        font-size: rem(16) !important;
    }
      `}
</style>)

export default class LanguageSelector extends Component {
    state = {
        locale: LocaleService.getCurrentLanguage()
    }

    chooseLanguage({ key }) {
        LocaleService.setCurrentLanguage(key);
        location.reload();
    }

    render() {
        const { locale } = this.state

        const langMenu = (
            <Menu className="menu" selectedKeys={[locale]} onClick={this.chooseLanguage}>
                <Menu.Item key="en">
                    <span role="img" aria-label="English" className="mr-2">
                        EN
              </span>
                    English
            </Menu.Item>
                <Menu.Item key="ur">
                    <span role="img" aria-label="Urdu" className="mr-2">
                        UR
              </span>
                    Urdu
            </Menu.Item>
            </Menu>
        )
        return (
            <>
                <Styles />
                <Dropdown overlay={langMenu} trigger={['click']}>
                    <div className="dropdown">
                        <strong className="text-uppercase">{locale}</strong>
                    </div>
                </Dropdown>
            </>
        )
    }
}
