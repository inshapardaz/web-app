import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { CallbackComponent } from "redux-oidc";
import userManager from "../services/userManager";
import { push } from 'connected-react-router';

class CallbackPage extends React.Component {
  render() {
    return (
      <CallbackComponent
        userManager={userManager}
        successCallback={
          () => {
          this.props.push("/");
          }
        }
        errorCallback={
          () => {
          this.props.push("/error");
          }
        }>
        <div>Redirecting...</div>
      </CallbackComponent>
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
