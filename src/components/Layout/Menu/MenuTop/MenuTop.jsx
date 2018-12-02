import React from 'react'
import { connect } from 'react-redux'
import { Menu } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import { reduce } from 'lodash'
import { setLayoutState } from '../../../../actions/ui'
import { default as menuData } from '../menuData'
import LiveSearch from '../../../LiveSearch/LiveSearch.jsx';
import ProfileMenu from '../../../ProfileMenu.jsx';
import ApiService from '../../../../services/api'
import rel from '../../../../utils/rel';

import './style.scss'

const SubMenu = Menu.SubMenu
const Divider = Menu.Divider

class MenuTop extends React.Component {
  state = {
    pathname: this.props.pathname,
    collapsed: this.props.collapsed,
    theme: this.props.theme,
    selectedKeys: '',
    openKeys: [''],
    settingsOpened: this.props.settingsOpened,
    isError: false,
    isLoading: false,
    categories: []
  }

  constructor(props)
  {
    super(props);
  }

  handleClick = e => {
    this.setState({
      selectedKeys: e.key,
      openKeys: e.keyPath,
    })
  }

  onOpenChange = openKeys => {
    this.setState({
      openKeys,
    })
  }

  getPath(data, id, parents = []) {
    const { selectedKeys } = this.state
    let items = reduce(
      data,
      (result, entry) => {
        if (result.length) {
          return result
        } else if (entry.url === id && selectedKeys === '') {
          return [entry].concat(parents)
        } else if (entry.key === id && selectedKeys !== '') {
          return [entry].concat(parents)
        } else if (entry.children) {
          let nested = this.getPath(entry.children, id, [entry].concat(parents))
          return nested ? nested : result
        }
        return result
      },
      [],
    )
    return items.length > 0 ? items : false
  }

  getActiveMenuItem = (props, items) => {
    const { selectedKeys, pathname } = this.state
    let { collapsed } = props
    let [activeMenuItem, ...path] = this.getPath(items, !selectedKeys ? pathname : selectedKeys)

    this.setState({
      selectedKeys: activeMenuItem ? activeMenuItem.key : '',
      collapsed,
    })
  }

  generateMenuPartitions(items) {
    return items.map(menuItem => {
      if (menuItem.children) {
        let subMenuTitle = (
          <span className="menuTop__title-wrap" key={menuItem.key}>
            <span className="menuTop__item-title">{menuItem.title}</span>
            {menuItem.icon && <span className={menuItem.icon + ' menuTop__icon'} />}
          </span>
        )
        return (
          <SubMenu title={subMenuTitle} key={menuItem.key}>
            {this.generateMenuPartitions(menuItem.children)}
          </SubMenu>
        )
      }
      return this.generateMenuItem(menuItem)
    })
  }

  generateMenuItem(item) {
    const { key, title, url, icon, disabled } = item
    const { dispatch } = this.props
    return item.divider ? (
      <Divider key={Math.random()} />
    ) : item.url ? (
      <Menu.Item key={key} disabled={disabled}>
        <Link
          to={url}
          onClick={
            this.props.isMobile
              ? () => {
                dispatch(setLayoutState({ menuCollapsed: false }))
              }
              : undefined
          }
        >
          <span className="menuTop__item-title">{title}</span>
          {icon && <span className={icon + ' menuTop__icon'} />}
        </Link>
      </Menu.Item>
    ) : (
          <Menu.Item key={key} disabled={disabled}>
            <span className="menuTop__item-title">{title}</span>
            {icon && <span className={icon + ' menuTop__icon'} />}
          </Menu.Item>
        )
  }

  componentWillMount() {
    this.getActiveMenuItem(this.props, menuData)
  }

  componentDidMount() {
    console.log(this.props.entry)
    if (this.props.entry){
      this.loadCategories(rel(this.props.entry.links, 'categories'));
    }
  }

  componentWillReceiveProps(newProps) {
    console.log(newProps.entry)
    if (newProps.entry){
      this.loadCategories(rel(newProps.entry.links, 'categories'));
    }

    this.setState(
      {
        theme: newProps.theme,
        settingsOpened: newProps.settingsOpened,
      },
      () => {
        if (!newProps.isMobile) {
          this.getActiveMenuItem(newProps, menuData)
        }
      },
    )
  }


  loadCategories(link)
  {
    console.log(`loadCategories(${link})`);
    const api = new ApiService(this.props.user);
    api.get(link)
      .then(
        (result) => {
          this.setState({
            isLoading: false,
            categories: result
          });
        },
        (error) => {
          this.setState({
            isLoading: false,
            isError: true
          });
        }
      )
  }
  render() {
    const { selectedKeys, openKeys, theme, categories } = this.state
    const { isMobile } = this.props

    let finalOptions = menuData;
    if (categories && categories.items) {
      finalOptions[1].children[4].children = [];
      categories.items.map(c => {
        finalOptions[1].children[4].children.push({
          title: c.name,
          key: c.id,
          url: `/books?category=${c.id}`,
        });
      });
    }

    const items = this.generateMenuPartitions(finalOptions)
    let menuItems;

    if (isMobile) {
      menuItems = <SubMenu title="...">{items}</SubMenu>
    }
    else {
      menuItems = items
    }

    return (
      <div className="menuTop">
        <div className="menuTop__logo">
          <div className="menuTop__logoContainer">
            <img src="resources/images/inshapardaz.png" alt="" />
          </div>
        </div>
        <Menu
          theme={theme}
          onClick={this.handleClick}
          selectedKeys={[selectedKeys]}
          openKeys={openKeys}
          onOpenChange={this.onOpenChange}
          mode="horizontal"
          className="menuTop__navigation"
        >
          {menuItems}

          <Menu.ItemGroup className="menuTop__right">
            <LiveSearch />
            <ProfileMenu />
          </Menu.ItemGroup>
        </Menu>

      </div>
    )
  }
}

export default withRouter(connect(
  ({ app, routing, oidc, apiReducer }, props) => {
    const { layoutState } = app
    return {
      user: oidc.user,
      collapsed: layoutState.menuCollapsed,
      theme: layoutState.themeLight ? 'light' : 'dark',
      settingsOpened: layoutState.settingsOpened,
      entry: apiReducer.entry
    }
  },
  null
)(MenuTop))
