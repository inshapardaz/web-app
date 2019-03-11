import React, { Component } from 'react'
import { Container, Grid, Header, List, Segment, } from 'semantic-ui-react'

export default class Footer extends Component {
    render() {
        if (this.props.mini)
        {
            return (
                <Segment fixed="bottom" inverted vertical style={{ padding: '1em 1em', marginTop: '5px' }}>
                    &copy; Inshapardaz.
                </Segment>
            );
        }

        return (
            <Segment inverted vertical style={{ padding: '5em 0em', marginTop: '5px' }}>
                <Container>
                    <Grid divided inverted stackable>
                        <Grid.Row>
                            <Grid.Column width={3}>
                                <Header inverted as='h4' content='About' />
                                <List link inverted>
                                    <List.Item as='a'>Sitemap</List.Item>
                                    <List.Item as='a'>Help</List.Item>
                                    <List.Item as='a'>Contact Us</List.Item>
                                </List>
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <Header inverted as='h4' content='Services' />
                                <List link inverted>
                                    <List.Item as='a'>Publish your work</List.Item>
                                    <List.Item as='a'>Preserve classics</List.Item>
                                    <List.Item as='a'>Legal &amp; Copyrights</List.Item>
                                </List>
                            </Grid.Column>
                            <Grid.Column width={7}>
                                <Header as='h4' inverted>
                                    &copy; Inshapardaz.
                                </Header>
                                <p>
                                    All rights of literary work reserved by respective writer or is in public domain.
                                </p>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </Segment>
        )
    }
}
