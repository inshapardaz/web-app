import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom'

class SearchBox extends Component {
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
    }

    onToggleSearchOverlay() {
        $('#page-header-search').toggleClass('show');
    }

    render() {
        const searchMessage = this.props.intl.formatMessage({ id: "header.search.placeholder" });
        return (
            <>
                <button type="button" className="btn btn-sm btn-dual d-sm-none" onClick={this.onToggleSearchOverlay}>
                    <i className="si si-magnifier" />
                </button>
                <form className="d-none d-sm-inline-block" method="POST" onSubmit={this.onSubmit}>
                    <div className="input-group input-group-sm">
                        <input type="text" className="form-control form-control-alt" placeholder={searchMessage} id="page-header-search-input2" name="page-header-search-input2" 
                               onChange={this.searchChange}
                               value={this.state.value} />
                        <div className="input-group-append" onClick={this.onSubmit}>
                            <span className="input-group-text bg-body border-0">
                                <i className="si si-magnifier" />
                            </span>
                        </div>
                    </div>
                </form>
            </>
        );
    }
}

export default withRouter(injectIntl(SearchBox));