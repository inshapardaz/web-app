import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl';
import { Segment, Image, Loader, Dimmer  } from 'semantic-ui-react';


export default class Loading extends Component {
    render() {
        return (
            <Segment>
                <Dimmer active inverted>
                    <Loader size='large'><FormattedMessage id='message.loading' /></Loader>
                </Dimmer>
                <Image src='/resources/img/paragraph.png' />
            </Segment>
        );
    }
}
