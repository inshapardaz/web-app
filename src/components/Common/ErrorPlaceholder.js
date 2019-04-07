import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Icon, Button, Segment, Header } from 'semantic-ui-react';


export default class ErrorPlaceholder extends Component {
    renderPlaceHolder() {
        const { message, showButton, buttonText, buttonAction, icon } = this.props;
        let button = null;
        if (showButton) {
            button = (
                <a className="tg-btn tg-btnstyletwo tg-active" href="javascript:void(0);" onClick={buttonAction}>
                    <em>{buttonText}</em>
                </a>)
        }

        return (
            <div className="tg-featurebook alert" role="alert">
                <div className="tg-featureditm">
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 hidden-sm hidden-xs">
                            <figure><img src="images/empty_book.png" alt="image description" /></figure>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                            <div className="tg-featureditmcontent" style={{ paddingTop: '100px' }}>
                                <div className="tg-booktitle">
                                    <h3><a href="javascript:void(0);">{message}</a></h3>
                                </div>
                                <div className="tg-priceandbtn">
                                    {button}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    render() {
        if (this.props.fullWidth)
        {
            return (<main id="tg-main" className="tg-main tg-haslayout">
            <div className="tg-authorsgrid">
              <div className="container">
                <div className="row">
                  {this.renderPlaceHolder()}
                </div>
              </div>
            </div>
          </main>);
        }
        else 
        {
            return this.renderPlaceHolder();
        }
    }
}

ErrorPlaceholder.propTypes = {
    message: PropTypes.string,
    showButton: PropTypes.bool,
    buttonText: PropTypes.string,
    buttonAction: PropTypes.func,
    icon: PropTypes.string
};
