import React, { Component } from 'react';
import ApiService from '../../services/ApiService';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';

import { injectIntl } from 'react-intl';

import { Pagination, List, Card, Switch } from 'antd';
import { Helmet } from 'react-helmet'

import { ErrorPlaceholder } from '../Common';
import AuthorCard from './AuthorCard';
import EditAuthor from './EditAuthor';

const cardStyle = {
    marginBottom: "12px"
}

class AuthorList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isError: false,
            isLoading: true,
            isAdding: false,
            query: null,
            pageNumber: 1,
            selectedAuthor: null,
            showCard: true,
            authors: null
        };

        this.onPageChanged = this.onPageChanged.bind(this);
    }

    async componentDidMount() {
        this.setState({
            showCard: JSON.parse(localStorage.getItem('authors.cardview'))
        })

        const values = queryString.parse(this.props.location.search)
        await this.loadAuthors(values.page ? values.page : 1, values.q ? values.q : null);
    }

    async componentWillReceiveProps(nextProps) {
        const { author } = nextProps

        const values = queryString.parse(nextProps.location.search)

        if (this.state.pageNumber != values.page ||
            //this.state.authorId != author ? author.id : 0 ||
            this.state.series != values.series ||
            this.state.category != values.category) {
            await this.loadAuthors(values.page ? values.page : 1, values.q ? values.q : null);
        }
    }

    reloadAuthors = async () => {
        await this.loadAuthors(this.state.pageNumber, this.state.query);
    }

    async loadAuthors(pageNumber = 1, query = null) {
        this.setState({
            isLoading: true,
            query: query,
            pageNumber: parseInt(pageNumber)
        });

        try {

            let result = await ApiService.getAuthors(pageNumber, 12, query);
            this.setState({
                isLoading: false,
                isError: false,
                authors: result
            });
        }
        catch (e) {
            console.error(e)
            this.setState({
                isLoading: false,
                isError: true
            });
        }
    }

    onPageChanged = (page) => {
        if (this.state.pageNumber != page) {
            if (search) {
                this.props.history.push(`/search?q=${search}&page=${page}`);
            }
            else {
                this.props.history.push(`/authors?page=${page}`);
            }
        }
    }

    renderLoadingError() {
        const { intl } = this.props;
        const message = intl.formatMessage({ id: 'authors.messages.error.loading' });
        const buttonText = intl.formatMessage({ id: 'action.retry' });
        return (<ErrorPlaceholder message={message} fullWidth={true}
            showButton={true} buttonText={buttonText}
            buttonAction={this.reloadAuthors.bind(this)} />)
    }

    renderAuthors = (authors, isLoading) => {
        const { showCard, pageNumber } = this.state;
        const grid = this.props.wide ?
            { gutter: 4, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 5 } :
            { gutter: 4, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 };
        const pagination = authors ? (<Pagination hideOnSinglePage
            size="small" showSizeChanger={false}
            current={pageNumber}
            total={authors ? authors.totalCount : 0}
            pageSize={authors ? authors.pageSize : 0}
            onChange={this.onPageChanged} />) : null;
        return (<List
            itemLayout={showCard ? null : "vertical"}
            size="small"
            loading={isLoading}
            locale={{
                emptyText: this.props.intl.formatMessage({ id: 'authors.messages.empty' })
            }}
            grid={showCard ? grid : null}
            dataSource={authors ? authors.data: []}
            renderItem={a => (<AuthorCard key={a.id} card={showCard} author={a} onUpdated={this.reloadAuthors} />)}
            header={this.props.noPaginate ? null : pagination }
            footer={this.props.noPaginate ? null : pagination }
        />);
    }

    renderAdd(createLink) {
        if (createLink) {
            return <EditAuthor button createLink={createLink} isAdding={true} onUpdated={this.reloadAuthors} />
        }

        return null;
    }

    onToggleCardView(checked) {
        localStorage.setItem('authors.cardview', checked);
        this.setState({ showCard: checked })
    }

    render() {
        const { authors, isLoading, isError } = this.state;

        if (isError) {
            return this.renderLoadingError();
        }

        const createLink = (authors && authors.links) ? authors.links.create : null;

        if (this.props.simple) {
            return (
                <>
                    <div className="content content-boxed">
                        <div className="row row-deck">
                            {this.renderAuthors(authors, isLoading)}
                        </div>
                    </div>
                </>
            );
        }

        const extras = (<>
            {this.renderAdd(createLink)}
            <span className="ml-2" />
            <Switch checkedChildren={this.props.intl.formatMessage({ id: "action.card" })}
                unCheckedChildren={this.props.intl.formatMessage({ id: "action.list" })}
                onChange={this.onToggleCardView.bind(this)} checked={this.state.showCard} />
        </>)
        return (
            <>
                <Helmet title={`${this.props.intl.formatMessage({ id: "header.authors" })} > ${this.props.title}`} />
                <Card title={this.props.title} type="inner" extra={extras} style={cardStyle} >
                    {this.renderAuthors(authors, isLoading)}
                </Card>
            </>
        );
    }
}

export default injectIntl(withRouter(AuthorList));

AuthorList.propTypes = {
    onUpdated: PropTypes.func,
    simple: PropTypes.bool,
    title: PropTypes.string,
    search: PropTypes.string,
    noPaginate: PropTypes.bool
};