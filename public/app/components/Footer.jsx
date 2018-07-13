import React from 'react';

import mapcLogo from '~/assets/images/mapc-logo.svg';
import twitterImg from '~/assets/images/twitter.svg';
import instagramImg from '~/assets/images/instagram.svg';


class Footer extends React.Component {

  render() {
    return (
      <footer>
        <div className="container">
          <img className="mapc-logo" src={mapcLogo} alt="MAPC Logo" />
          <ul className="contact-list">
            <li>
              <a href="https://goo.gl/maps/5GP7YcEtS1E2">
                60 Temple Place, Boston, MA 02111
              </a>
            </li>
            <li>
              <a href="tel:617-451-2770">
                617-451-2770
              </a>
            </li>
            <li>
              <a href="mailto:hello@datacommon.org">
                hello@datacommon.org
              </a>
            </li>
          </ul>

          <div className="social">
            Follow MAPC:
            <ul className="social-list">
              <li>
                <a href="https://twitter.com/MAPCMetroBoston">
                  <img src={twitterImg} alt="MAPC on Twitter" />
                </a>
              </li>
              <li>
                <a href="">
                  <img src={instagramImg} alt="MAPC on Instagram" />
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
