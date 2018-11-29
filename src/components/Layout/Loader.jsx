import React from 'react'
import { connect } from 'react-redux'

class Loader extends React.Component {
  render() {
    const { isHideLogin } = this.props
    if (!isHideLogin) return null
    return <div className="utils__loadingPage" />
  }
}

export default connect(
  state => ({
    isHideLogin: state.app.isHideLogin,
  }),
  null
)(Loader)
