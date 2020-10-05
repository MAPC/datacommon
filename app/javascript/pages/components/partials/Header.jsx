import React from 'react';
import logoImg from '../../assets/images/logo.svg';

function handleActivePage(subdirectory, link = '/home') {
  if (subdirectory.startsWith(link)) {
    return 'active';
  } if (subdirectory.startsWith('/calendar') && link === '/gallery') {
    return 'active';
  }
  return null;
}

const Header = ({ location }) => (
  <header className="container">
    <nav>
      <div className="scroll-wrapper">
        <div className="header-brand">
          <a href="/">
            <img src={logoImg} alt="DataCommon Logo" />
            DataCommon
          </a>
        </div>

        <ul>
          <li><a className={handleActivePage(location.pathname, '/browser')} href="/browser">Datasets</a></li>
          <li><a className={handleActivePage(location.pathname, '/profile')} href="/#community-profiles">Community Profiles</a></li>
          <li><a className={handleActivePage(location.pathname, '/gallery')} href="/gallery">Gallery</a></li>
        </ul>
      </div>
    </nav>
  </header>
);

export default Header;
export { handleActivePage };
