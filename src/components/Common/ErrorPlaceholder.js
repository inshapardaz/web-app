import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Icon, Button, Segment, Header } from 'semantic-ui-react';


export default class ErrorPlaceholder extends Component {
    render() {
        const {message, showButton, buttonText, buttonAction} = this.props;
        let button = null;
        if (showButton){
            button = <Button fluid style={{ display: 'block', marginTop: "20px" }} onClick={buttonAction}>{buttonText}</Button>
        }
        return (
            <Segment placeholder={true} textAlign="center">
                <Header icon style={{ marginTop: "50px", marginBottom: "50px" }}>
                    <Icon name='warning circle' />
                    {message}
                    {button}
                </Header>

            </Segment>
        );
    }
}

ErrorPlaceholder.propTypes = {
    message: PropTypes.string,
    showButton: PropTypes.bool,
    buttonText: PropTypes.string,
    buttonAction: PropTypes.func
};
