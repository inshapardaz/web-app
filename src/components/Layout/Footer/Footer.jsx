import React from 'react'
import { Button } from 'antd'
import './style.scss'

class AppFooter extends React.Component {
  render() {
    return (
      <div className="footer">
        <div className="footer__bottom">
          <div className="row">
            <div className="col-sm-4">
              <img
                  src="/resources/images/inshapardaz_black.png" width="46"
                  target="_blank"
                  rel="noopener noreferrer"
                  alt="Inshapardaz"
                />
            </div>
            <div className="col-sm-6">
              <div className="footer__copyright">

                <span>
                  © 2018{' '}
                  <a href="/" target="_blank" rel="noopener noreferrer">
                    Inshapardaz
                  </a>
                  <br />
                  All rights reserved
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AppFooter
