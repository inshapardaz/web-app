import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Icon, Button, Segment, Header } from 'semantic-ui-react';


export default class EmptyPlaceholder extends Component {
    render() {
        const {message, iconName, showButton, buttonText, buttonAction} = this.props;
        let button = null;
        if (showButton){
            button = <Button fluid style={{ display: 'block', marginTop: "20px" }} onClick={buttonAction}>{buttonText}</Button>
        }
        return (
            <Segment placeholder={true} textAlign="center">
                <Header icon style={{ marginTop: "50px", marginBottom: "50px" }}>
                    <Icon name={iconName} />
                    {message}
                    {button}
                </Header>

            </Segment>
        );
    }
}

EmptyPlaceholder.propTypes = {
    message: PropTypes.string,
    iconName: PropTypes.string,
    showButton: PropTypes.bool,
    buttonText: PropTypes.string,
    buttonAction: PropTypes.func
};
