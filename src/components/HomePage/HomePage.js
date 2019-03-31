import React from 'react';
import {Link} from 'react-router-dom';
import { Button, Segment, Header, Icon } from 'semantic-ui-react'
import {FormattedMessage} from 'react-intl';


class HomePage extends React.Component {
    render() {
        const mobile = false;
        return (
            <>
            <Segment inverted
            textAlign='center'
            style={{ minHeight: 700, 
                     padding: '1em 0em', 
                     background: 'url(resources/img/main.jpg) no-repeat center center', 
                     backgroundSize: 'cover'}}
            vertical>
                <Header
                    as='h1'
                    content={<FormattedMessage id="app"/>}
                    inverted
                    style={{
                        fontSize: mobile ? '2em' : '4em',
                        fontWeight: 'normal',
                        marginBottom: 0,
                        marginTop: mobile ? '1.5em' : '3em',
                    }}
                />
                <Header
                    as='h2'
                    content={<FormattedMessage id="slogan"/>}
                    inverted
                    style={{
                        fontSize: mobile ? '1.5em' : '1.7em',
                        fontWeight: 'normal',
                        marginTop: mobile ? '0.5em' : '1.5em',
                    }}
                />
                <Button primary size='huge' as={Link} to="/books">
                    <FormattedMessage id="home.getStarted"/>
                    <Icon name='right arrow' />
                </Button>
            </Segment>
            </>
        );
    }
}

export default HomePage;