import React from 'react';

import mapcLogo from '~/assets/images/mapc-logo.svg';
import twitterImg from '~/assets/images/twitter.svg';
import instagramImg from '~/assets/images/instagram.svg';
import facebookImg from '~/assets/images/facebook.svg';


class Footer extends React.Component {

  render() {
    return (
      <footer>
        <div className="container">
          <a href="https://mapc.org">
            <img className="mapc-logo" src={mapcLogo} alt="MAPC Logo" />
          </a>

          <ul className="contact-list">
            <li>
              <a href="https://goo.gl/maps/5GP7YcEtS1E2">
                60 Temple Place<span className="break">,</span> Boston, MA 02111
              </a>
            </li>
            <li>
              <a href="tel:617-933-0700">
                617-933-0700
              </a>
            </li>
            <li>
              <a href="mailto:datacommon@mapc.org">
                datacommon@mapc.org
              </a>
            </li>
          </ul>

          <div className="blank-grid-cell"></div>

          <div className="social">
            Follow MAPC:
            <ul className="social-list">
              <li>
                <a href="https://twitter.com/MAPCMetroBoston" target="_blank">
                  <img src={twitterImg} alt="MAPC on Twitter" />
                </a>
              </li>
              <li>
                <a href="https://instagram.com/mapcmetroboston" target="_blank">
                  <img src={instagramImg} alt="MAPC on Instagram" />
                </a>
              </li>
              <li>
                <a href="https://facebook.com/MAPCMetroBoston" target="_blank">
                  <img src={facebookImg} alt="MAPC on Facebook" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    );
  }

};

export default Footer;
