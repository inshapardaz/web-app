import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import ApiService from '../../services/ApiService';
import { injectIntl } from 'react-intl';
import { List, Card, Menu, Dropdown, Icon } from 'antd';

import { ErrorPlaceholder, EmptyPlaceholder } from '../Common';
import EditChapter from './EditChapter';
import ChapterCard from './ChapterCard';
import PropTypes from 'prop-types';

const cardStyle = {
    marginBottom: "12px"
}

class ChapterList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isError: false,
            isLoading: true,
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
            const { chapters } = this.state;
            var nextChapter = (chapters && chapters.items) ? chapters.items.length + 1 : 1;
            return <EditChapter button createLink={createLink} isAdding={true} onUpdated={this.loadChapters} chapterIndex={nextChapter} />
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

    renderDropDown = (chapters) => {
        const { selectedChapter } = this.props;
        var items = [];
        if (chapters && chapters.items) {
            items = chapters.items.map(c => (
                <Menu.Item key={c.id}>
                    <Link to={`/books/${c.bookId}/chapters/${c.id}`}>{c.title}</Link>
                </Menu.Item>));
        }
        const selectedKey = selectedChapter ? selectedChapter.id : null;
        return (<Menu selectedKeys={[`${selectedKey}`]}> {items} </Menu>);
    }


    render() {
        const { isError, chapters } = this.state;
        const createLink = (chapters && chapters.links) ? chapters.links.create : null;

        if (isError) {
            return this.renderLoadingError();
        }

        if (this.props.dropdown) {
            var overlay = this.renderDropDown(chapters);
            return (<Dropdown overlay={overlay} trigger={['click']}>
                <a className="ant-dropdown-link" href="#">
                    {this.props.selectedChapter.title} <Icon type="down" />
                </a>
            </Dropdown>);
        }
        else if (this.props.simple) {
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
                <Card title={this.props.intl.formatMessage({ id: "chapter.toolbar.chapters" })} type="inner" extra={this.renderAdd(createLink)} style={cardStyle}>
                    {this.renderChapters()}
                </Card>
            </>
        );
    }
}
export default injectIntl(ChapterList);

ChapterList.propTypes = {
    book: PropTypes.object.isRequired,
    selectedChapter: PropTypes.object,
    dropdown: PropTypes.bool,
    simple: PropTypes.bool
};