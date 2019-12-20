import React from 'react';
import PropTypes from 'prop-types';

import Particles from './partials/Particles';
import SearchBar from '../containers/SearchBar';
import CategoryGrid from '../containers/CategoryGrid';
import CommunitySelector from '../containers/CommunitySelector';
import CalendarImg from './../assets/images/calendar-temp'

class Home extends React.Component {

  constructor() {
    super(...arguments);

    this.toDataset = this.toDataset.bind(this);
  }


  componentWillMount() {
    this.props.fetchDatasets();
  }


  toDataset(dataset) {
    // We need to direct away from the page without using React Router's push()
    // function since the databrowser is currently an Ember app.
    window.location.pathname = `/browser/datasets/${dataset.id}`;
  }


  render() {
    return (
      <section className="route Home">
        <div className="page-header">
          <Particles />

          <div className="container tight">
            <SearchBar
              contextKey={'dataset'}
              searchColumn={'title'}
              action={selected => this.toDataset(selected)}
              placeholder={`Search ${this.props.datasets.length} datasets ...`}
            />
          </div>
        </div>

        <section className="container tight gallery-spotlight page-section">
          <div className="gallery-spotlight__info">
            <h2>Gallery of Data</h2>
            <p className="gallery-spotlight__paragraph">MAPC has for many years produced a wall calendar that provides recipients with insightful information about the region, in the form of a monthly map or data visualization. Each year, these monthly segments covered a wide variety of topics.</p>
            <p className="gallery-spotlight__paragraph">This year, we are moving to a new format, with two components: the print calendar and digital maps and data visualizations we will publish each month here on MAPC's MetroBoston DataCommon. We hope you will both hand this poseter on your wall, and visit datacommon.mapc.org to see a new map or data visualization on the first of each month.</p>
            <button className="gallery-spotlight__button"><a href="/gallery">View Gallery</a></button>

          </div>
          <img src={CalendarImg} className="gallery-spotlight__image"/>
        </section>


        <div className="container tight page-section">
          <h2>Data by category</h2>

          <CategoryGrid />
        </div>

        <div className="page-section page-section__map">
          <a name="community-profiles"></a>
          <CommunitySelector />
        </div>
      </section>
    );
  }

}


Home.propTypes = {
  datasets: PropTypes.arrayOf(PropTypes.object).isRequired,
  fetchDatasets: PropTypes.func.isRequired,
};

export default Home;

