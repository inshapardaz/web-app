import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import ApiService from '../../services/ApiService';

class ChaptersMenu extends Component {
    state = {
        isLoading: false,
        isError: false,
        chapters: null
    };

    async componentDidMount() {
        await this.loadData()
    }

    async componentWillReceiveProps(nextProps) {
        if (this.props.chapterId != nextProps.chapterId) {
            await this.loadData()
        }
    }

    async loadData() {
        this.setState({
            isLoading: true,
            isError: false
        });

        try {
            var chapters = await ApiService.getChapters(this.props.bookId);

            this.setState({
                isLoading: false,
                isError: false,
                chapters: chapters
            });
        }
        catch (e) {
            this.setState({
                isLoading: false,
                isError: true,
                chapters: null
            });
        }
    }

    render() {
        const { chapters, isError, isLoading } = this.state;
        const { selectedChapter } = this.props;

        let options = [];
        if (!isLoading && chapters) {
            options = chapters.items.map(c => (
                <li className="nav-main-item" key={c.id}>
                    <Link className="nav-main-link" to={`/books/${this.props.bookId}/chapters/${c.id}`}>
                        <i className="nav-main-link-icon fa fa-file-alt text-primary"></i>
                        <span className="nav-main-link-name">{c.title}</span>
                    </Link>
                </li>
            ));
        }

        return (
            <>
                <li className="nav-main-heading"><FormattedMessage id="chapter.toolbar.chapters" /></li>
                {options}
            </>);
    }
}

export default injectIntl(ChaptersMenu)

ChaptersMenu.propTypes = {
    bookId: PropTypes.number.isRequired,
    selectedChapter: PropTypes.number.isRequired
};