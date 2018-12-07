import React from 'react';
import { Skeleton } from 'antd';

class Page extends React.Component {
  render() {
    const { isError, isLoading, title, children } = this.props;

    if (isError) {
      return (
        <section className="card">
          <div className="card-body">Unable to load</div>
        </section>);
    }
    else if (isLoading && !children) {
      return (
        <section className="card">
          <div className="card-body">
            <Skeleton avatar paragraph={{ rows: 4 }} />
          </div>
        </section>);
    }
    var titleDiv = title ? (
      <div className="card-header">
        {title}
      </div>) :
      null;
    return (
      <div className="utils__content">
        <section className="card">
          {titleDiv}
          <div className="card-body">
            {children}
          </div>
        </section>
      </div>
    );
  }
}

export default Page;
