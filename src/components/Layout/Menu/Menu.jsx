import 'rc-drawer/assets/index.css'
import React from 'react'
import MenuTop from './MenuTop/MenuTop.jsx'
import { connect } from 'react-redux'
import { setLayoutState } from '../../../actions/ui'
import './style.scss'

class AppMenu extends React.Component {
  state = {
    open: this.props.open,
    isMenuTop: this.props.isMenuTop,
  }

  toggleOpen = () => {
    const { dispatch } = this.props
    const { open } = this.state
    dispatch(setLayoutState({ menuMobileOpened: !open }))
  }

  componentWillReceiveProps({ open, isMenuTop }) {
    this.setState({
      open,
      isMenuTop,
    })
  }

  render() {
    return (<MenuTop {...this.props} />);
  }
}

export default connect(({ app }, props) => ({
    open: app.layoutState.menuMobileOpened,
    isMenuTop: app.layoutState.isMenuTop,
  }),
  null
)(AppMenu);
