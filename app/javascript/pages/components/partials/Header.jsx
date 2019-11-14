import React from 'react';

import logoImg from '../../../assets/images/logo.svg';


class Header extends React.Component {

  render() {
    const highlightCPLink = this.props.location.pathname.startsWith('/profile');

    return (
      <header>
        <div className="container">
          <nav>
            <div className="scroll-wrapper">
              <div className="header-brand">
                <a href="/">
                  <img src={logoImg} alt="DataCommon Logo" />
                  DataCommon
                </a>
              </div>

              <ul>
                <li><a href="/browser">Datasets</a></li>
                <li><a className={highlightCPLink ? 'active' : null} href="/#community-profiles">Community Profiles</a></li>
                <li><a href="/gallery">Gallery</a></li>
              </ul>
            </div>
          </nav>
        </div>
      </header>
    );
  }

};

export default Header;
