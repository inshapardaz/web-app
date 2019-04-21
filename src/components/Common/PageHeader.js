import React, { Component } from 'react'
import PropTypes from 'prop-types';

export default class PageHeader extends Component {
    render() {
        if (this.props.size === 'large') {
            return (<div className="bg-image" style={{ backgroundImage: `url(${this.props.backgroundImage})` }}>
                <div className="bg-primary-dark-op">
                    <div className="content content-full overflow-hidden">
                        <div className="mt-7 mb-5 text-center">
                            <h1 className="h2 text-white mb-2" >{this.props.title}</h1>
                            {this.props.subtitle ?
                                <h2 className="h4 font-w400 text-white-75" >{this.props.subtitle}</h2>
                                : null}
                        </div>
                    </div>
                </div>
            </div>);
        }

        return (
            <div className="bg-body-light">
                <div className="content content-full">
                    <div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
                        <h1 className="flex-sm-fill h3 my-2">
                            {this.props.title}
                            {this.props.subtitle ?
                                <small className="d-block d-sm-inline-block mt-2 mt-sm-0 font-size-base font-w400 text-muted">{this.props.subtitle}</small>
                                : null}
                        </h1>
                    </div>
                </div>
            </div>
        );
    }
}

PageHeader.propTypes = {
    title: PropTypes.object.isRequired,
    subtitle: PropTypes.string,
    size: PropTypes.string,
    backgroundImage: PropTypes.string
};
