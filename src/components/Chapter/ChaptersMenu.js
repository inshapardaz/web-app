import React, { Component } from 'react';
import {Link} from 'react-router-dom';
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
            options =  chapters.items.map(c => (
                            <Dropdown.Item 
                                    key={c.id} value={c.id}
                                    as={Link} 
                                    to={`/books/${this.props.bookId}/chapters/${c.id}`}>
                                {c.title}
                            </Dropdown.Item>))
        }

        return (<Dropdown text={this.props.intl.formatMessage({id:'chapter.toolbar.chapters'})} pointing
            error={isError}
            loading={isLoading}
            className='link item'
            value={selectedChapter} >
             <Dropdown.Menu>{options}</Dropdown.Menu>
            </Dropdown>);
    }
}

export default injectIntl(ChaptersMenu)

ChaptersMenu.propTypes = {
    bookId: PropTypes.string.isRequired,
    selectedChapter: PropTypes.string.isRequired
};