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
        successCallback={() => {
          console.log("user signed in");
          this.props.history.push("/");}}
        errorCallback={error => {
          this.props.dispatch(push("/"));
          console.error(error);
        }}
        >
        <div>Redirecting...</div>
      </CallbackComponent>
    );
  }
}

CallbackPage.propTypes = {
  history: PropTypes.object.isRequired
}

export default connect()(CallbackPage);
