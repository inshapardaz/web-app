import React from 'react'
import ProfileMenu from './ProfileMenu'
import HomeMenu from './HomeMenu'
import LiveSearch from './LiveSearch/LiveSearch.jsx'
import './style.scss'

class TopBar extends React.Component {
  render() {
    return (
      <div className="topbar">
        <div className="topbar__left">
          <HomeMenu />
          <LiveSearch />
        </div>
        <div className="topbar__right">
          <ProfileMenu />
        </div>
      </div>
    )
  }
}

export default TopBar
