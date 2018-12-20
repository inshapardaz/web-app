import React from 'react';
import userManager from '../utils/userManager';
class SilentRefresh extends React.Component
{
  render() {
    userManager.signinSilentCallback();
    return null;
  }
}

export default SilentRefresh
