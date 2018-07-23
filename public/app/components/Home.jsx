import React from 'react';

import SearchBar from '../containers/SearchBar';
import MuniSelect from '../containers/MuniSelect';
import CategoryGrid from '../containers/CategoryGrid';
import Particles from './partials/Particles';

import massPoly from '~/assets/images/mass.svg';


class Home extends React.Component {

  render() {
    return (
      <section className="route Home">

        <div className="page-header">
          <Particles />

          <div className="container tight">
            <SearchBar />
          </div>
        </div>

        <div className="container tight page-section">
          <h2>Data by category</h2>

          <CategoryGrid />
        </div>

        <div className="page-section grey">
          <div className="container tight">
            <h2>Community Profiles</h2>
            <div className="columns two">
              <div className="column">
                Select a community to view their profile:

                <MuniSelect onSelect={muni => this.redirectTo(muni)} />
              </div>

              <div className="column">
                <img src={massPoly} />
              </div>
            </div>
          </div>
        </div>

      </section>
    );
  }

}

export default Home;
