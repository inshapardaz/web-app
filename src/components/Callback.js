import React from "react";
import { connect } from "react-redux";
import { CallbackComponent } from "redux-oidc";
import { push } from "connected-react-router";
import userManager from "../utils/userManager";
import PropTypes from "prop-types";

class CallbackPage extends React.Component {
  render() {
    return (
      <CallbackComponent
        userManager={userManager}
        successCallback={() => this.props.history.push("/")}
        errorCallback={error => {
          this.props.history.push("/");
          console.error(error);
        }}
        >
        <div>Redirecting...</div>
      </CallbackComponent>
    );
  }
}

export default connect()(CallbackPage);
