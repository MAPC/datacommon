import React from 'react';

import SearchBar from '../containers/SearchBar';
import CategoryGrid from '../containers/CategoryGrid';


class Home extends React.Component {

  render() {
    return (
      <section className="route Home">

        <div className="page-header">
          <div className="container tight">
            <SearchBar />
          </div>
        </div>

        <div className="container tight">
          <h2>Data by category</h2>

          <CategoryGrid />
        </div>

        <div className="grey-section">
          <div className="container tight">
            <h2>Community Profiles</h2>
          </div>
        </div>

      </section>
    );
  }

}

export default Home;
