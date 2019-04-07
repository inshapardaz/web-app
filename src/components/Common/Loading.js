import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl';

export default class Loading extends Component {
    renderLoading() {
        return (
            <div className="tg-featurebook alert" role="alert">
                <div className="tg-featureditm">
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 hidden-sm hidden-xs">
                        <figure><img src="/images/book-dribbble.gif" alt="image description" /></figure>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                            <div className="tg-featureditmcontent" style={{ paddingTop: '100px'}}>
                                <div className="tg-booktitle">
                                    <h3><FormattedMessage id="message.loading"/></h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    render() {

        if (this.props.fullWidth)
        {
            return (<main id="tg-main" className="tg-main tg-haslayout">
            <div className="tg-authorsgrid">
              <div className="container">
                <div className="row">
                  {this.renderLoading()}
                </div>
              </div>
            </div>
          </main>);
        }
        else 
        {
            return this.renderLoading();
        }
    }
}
