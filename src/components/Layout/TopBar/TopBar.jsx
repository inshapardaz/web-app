import React from 'react'
import HomeMenu from './HomeMenu'
import LiveSearch from '../../LiveSearch/LiveSearch.jsx'
import ProfileMenu from '../../ProfileMenu'
import './style.scss'

class TopBar extends React.Component {
  render() {
    return (
      <div className="topbar">
        <div className="topbar__left">
          <HomeMenu />
        </div>
        <div className="topbar__right">
          <LiveSearch />
          <ProfileMenu />
        </div>
      </div>
    )
  }
}

export default TopBar
