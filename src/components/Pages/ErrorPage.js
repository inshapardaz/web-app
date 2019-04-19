import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl';

export default class ErrorPage extends Component {
	render() {
		return (
			<main id="main-container">
				<div className="hero">
					<div className="hero-inner text-center">
						<div className="content content-full bg-white overflow-hidden">
							<div className="py-4">
								<h1 className="display-1 text-modern" >500</h1>
								<h2 className="h3 font-w300 text-muted mb-5" ><FormattedMessage id="message.error.server" /></h2>
							</div>
						</div>
						<div className="content content-full font-size-sm text-muted">
							<a className="link-fx" href="/"><FormattedMessage id="action.goto.home"/></a>
						</div>
					</div>
				</div>
			</main>
		)
	}
}
