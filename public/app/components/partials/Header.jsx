import React from 'react';

import logoImg from '~/assets/images/logo.svg';


class Header extends React.Component {

  render() {
    return (
      <header>
        <div className="container">
          <nav>
            <div className="header-brand">
              <a href="/">
                <img src={logoImg} alt="DataCommon Logo" />
                DataCommon
              </a>
            </div>

            <ul>
              <li><a href="/browser">Datasets</a></li>
              <li><a href="/community-profiles">Community Profiles</a></li>
              <li><a href="/faq">FAQ</a></li>
            </ul>
          </nav>

          <button className="login-button">Login</button>
        </div>
      </header>
    );
  }

};

export default Header;
