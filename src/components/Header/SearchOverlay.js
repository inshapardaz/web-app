import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom'

class SearchOverlay extends Component {
    state = {
        value: '',
    }

    searchChange = (event)  => {
        this.setState({
            value : event.target.value
        });
    }

    onSubmit = (event) => {
        event.preventDefault();
        this.props.history.push(`/search?q=${this.state.value}`)
        $('#page-header-search').toggleClass('show');
    }

    onClose() {
        $('#page-header-search').toggleClass('show');
    }

    render() {
        const searchMessage = this.props.intl.formatMessage({ id: "header.search.placeholder" });

        return (
            <div id="page-header-search" className="overlay-header bg-white">
                <div className="content-header">
                    <form className="w-100" method="POST" onSubmit={this.onSubmit}>
                        <div className="input-group input-group-sm">
                            <div className="input-group-prepend">
                                <button type="button" className="btn btn-danger" onClick={this.onClose}>
                                    <i className="fa fa-fw fa-times-circle"></i>
                                </button>
                            </div>
                            <input type="text" className="form-control" placeholder={searchMessage} id="page-header-search-input" name="page-header-search-input"
                                onChange={this.searchChange}
                                value={this.state.value}  />
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
export default withRouter(injectIntl(SearchOverlay));