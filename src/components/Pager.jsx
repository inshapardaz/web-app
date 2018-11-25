import React from 'react';
import PropTypes from "prop-types";
import rel from '../utils/rel';

class Pager extends React.Component {

  onNextClick = (e) => {
    if (typeof this.props.onNext === 'function') {
      const link = rel(this.props.source.links, 'next');
      this.props.onNext(link);
    }
  }

  onPreviousClick = (e) => {
    if (typeof this.props.onNext === 'function') {
      const link = rel(this.props.source.links, 'previous');
      this.props.onPrev(link);
    }
  }

  render() {
    if (this.props.source && this.props.source.links) {
      const prevHref = rel(this.props.source.links, 'previous');
      const nextHref = rel(this.props.source.links, 'next');

      return (
        <div>
          <button disabled={!prevHref} onClick={this.onPreviousClick}>&lt;</button>
          Page {this.props.source.currentPageIndex} of {this.props.source.pageCount}
          <button disabled={!nextHref} onClick={this.onNextClick}>&gt;</button>
        </div>);
    }

    return null;
  }
}

Pager.propTypes = {
  source: PropTypes.object,
  onNext: PropTypes.func,
  onPrev: PropTypes.func
};

export default Pager;
