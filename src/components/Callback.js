import React from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { CallbackComponent } from "redux-oidc";
import userManager from "../utils/userManager";

class CallbackPage extends React.Component {
  render() {
    return (
      <CallbackComponent
        userManager={userManager}
        successCallback={
          () => {
          this.props.history.push("/");
          }
        }
        errorCallback={
          () => {
          this.props.history.push("/");
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

export default connect()(CallbackPage);
