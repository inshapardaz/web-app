import React, { Component } from 'react'
import ApiService from '../../services/ApiService';
import { injectIntl, FormattedMessage } from 'react-intl';
import { List, Switch, Card } from 'antd';

import { ErrorPlaceholder, EmptyPlaceholder, Loading } from '../Common';
import EditChapter from './EditChapter';
import ChapterCard from './ChapterCard';

const cardStyle = {
    marginBottom: "12px"
}

class ChapterList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isError: false,
            isLoading: false,
            chapters: {}
        };

        this.loadChapters = this.loadChapters.bind(this);
    }

    async componentDidMount() {
        await this.loadChapters();
    }

    async componentWillReceiveProps() {
        await this.loadChapters();
    }

    async loadChapters() {
        const { book } = this.props;
        if (book) {
            this.setState({
                isLoading: true
            });

            try {
                var chapters = await ApiService.getBookChapters(book);
                this.setState({
                    isError: false,
                    isLoading: false,
                    chapters: chapters
                })
            }
            catch (e) {
                console.error(e);
                this.setState({
                    isError: true,
                    isLoading: false
                })
            }

        }
    }

    onAddChapter = () => this.setState({ isAdding: true })
    onCloseEdit = () => this.setState({ isAdding: false })

    renderLoadingError() {
        const { intl } = this.props;
        const message = intl.formatMessage({ id: 'chapters.messages.error.loading' });
        const buttonText = intl.formatMessage({ id: 'action.retry' });
        return (<ErrorPlaceholder message={message}
            showButton={true} buttonText={buttonText}
            buttonAction={this.loadChapters.bind(this)} />)
    }

    renderEmptyPlaceHolder(createLink) {
        const { intl } = this.props;
        const message = intl.formatMessage({ id: 'chapters.messages.empty' });
        return (
          <EmptyPlaceholder fullWidth={true} description={message} iconName='file' showButton={false} >
            {this.renderAdd(createLink)}
          </EmptyPlaceholder>
        );
    }

    renderAdd(createLink) {
        if (createLink) {
         return <EditChapter button createLink={createLink} isAdding={true} onUpdated={this.loadChapters} />
        }
    
        return null;
      }

    renderChapters = (hideAction = false) => {
        const { isLoading, chapters } = this.state;
        return (<List
            size="large"
            loading={isLoading}
            dataSource={chapters.items}
            renderItem={c => <ChapterCard key={c.id} chapter={c} onUpdated={this.loadChapters} hideActions={hideAction} />}
        />);
    }


    render() {
        const { isError, chapters } = this.state;
        const createLink = (chapters && chapters.links) ? chapters.links.create : null;

        if (isError) {
            return this.renderLoadingError();
        }

        if (!chapters) {
            return null;
        }

        if (chapters && chapters.items && chapters.items.length > 0) {
            if (this.props.simple) {
                return (
                    <>
                        <table className="table table-hover table-vcenter font-size-sm">
                            <tbody>
                                {this.renderChapters(true)}
                            </tbody>
                        </table>
                    </>
                )
            }

            return (
                <>
                    <Card title={this.props.intl.formatMessage({ id: "chapter.toolbar.chapters" })} type="inner" extra={this.renderAdd(createLink)}  style={cardStyle}>
                        {this.renderChapters()}
                    </Card>
                </>
            );
        } else {
            return this.renderEmptyPlaceHolder(createLink);
        }
    }
}
export default injectIntl(ChapterList);