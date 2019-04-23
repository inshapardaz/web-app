import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import ApiService from '../../services/ApiService';

class ChaptersMenu extends Component {
    state = {
        isLoading: false,
        isError: false,
        chapters: null,
        subMenuOpen: false
    };

    async componentDidMount() {
        await this.loadData()
    }

    async componentWillReceiveProps(nextProps) {
        if (this.props.bookId != nextProps.bookId) {
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

    renderChapters() {
        const { chapters, isError, isLoading } = this.state;
        const { selectedChapter } = this.props;

        if (isError) {
            return (<div className="text-center" role="status">
                <span className="text-muted">Error loading chapters</span><br />
                <button className="btn btn-sm btn-outline-primary py-4" onClick={this.loadData.bind(this)}><i className="si si-refresh" /></button>
            </div>)
        }

        if (isLoading) {
            return (<div className="spinner-border spinner-border-sm my-3" role="status">
                <span className="my-3"></span>
            </div>)
        }
        if (chapters != null) {
            return chapters.items.map(chapter => (<li key={chapter.id} className="nav-main-item">
                <Link className={`nav-main-link ${(selectedChapter.id == chapter.id) ? 'active' : ''}`} onClick={this.closeMenu} to={`/books/${chapter.bookId}/chapters/${chapter.id}`}>
                    <i className="fa fa-book mr-2" />
                    <span className="nav-main-link-name">{chapter.title}</span>
                </Link>
            </li>));
        }

        return null;
    }
    toggleMenuOpen = () => this.setState(prevState => ({
        subMenuOpen: !prevState.subMenuOpen
    }));

    render() {
        return (
            <li key="chapters" className={`nav-main-item ${this.state.subMenuOpen ? 'open' : null}`}>
                <a className="nav-main-link nav-main-link-submenu" onClick={this.toggleMenuOpen} aria-haspopup="true" aria-expanded="false" href="#">
                    <i className="nav-main-link-icon si si-book-open" />
                    <span className="nav-main-link-name">{this.props.selectedChapter.title}</span>
                </a>
                <ul className="nav-main-submenu">
                    {this.renderChapters()}
                </ul>
            </li>
        );

        // let options = [];
        // if (!isLoading && chapters) {
        //     options = chapters.items.map(c => (
        //         <li className="nav-main-item" key={c.id}>
        //             <Link className="nav-main-link" to={`/books/${this.props.bookId}/chapters/${c.id}`}>
        //                 <i className="nav-main-link-icon fa fa-file-alt text-primary"></i>
        //                 <span className="nav-main-link-name">{c.title}</span>
        //             </Link>
        //         </li>
        //     ));
        // }

        // return (
        //     <>
        //         <li key="books"className="nav-main-heading"><FormattedMessage id="chapter.toolbar.chapters" /></li>
        //         {options}
        //     </>);
    }
}

export default injectIntl(ChaptersMenu)