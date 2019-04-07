import React from 'react';

class NotFoundPage extends React.Component
{

    render() {
        return (
            <main id="tg-main" className="tg-main tg-haslayout">
			<div className="tg-sectionspace tg-haslayout">
				<div className="container">
					<div className="row">
						<div className="tg-404error">
							<div className="col-xs-12 col-sm-12 col-md-8 col-md-push-2 col-lg-6 col-lg-push-3">
								<div className="tg-404errorcontent">
									<h2>Ooops! Could Not Find It</h2>
									<span>404</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
        );
    }
}

export default NotFoundPage;