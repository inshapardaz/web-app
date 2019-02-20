import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { push } from 'connected-react-router';

import AuthService from '../services/AuthService';

class CallbackPage extends React.Component {
  
  componentDidMount(){
    AuthService.handleAuthentication();
  }

  render() {
    return (
      <div className="loader">
      </div>
    );
  }
}

CallbackPage.propTypes = {
  history: PropTypes.object.isRequired,
}

export default connect(
  null, 
  dispatch => bindActionCreators({
    push: push
  }, dispatch)
  )(CallbackPage);
