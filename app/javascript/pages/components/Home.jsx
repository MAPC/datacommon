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
            <p>Welcome to the MAPC Gallery of Data, where we tell the story of Greater Boston’s most complex issues — one monthly map and data visualization at a time.</p>
            <p>We look at a range of vital and interrelated topics: equity, housing, transportation, climate, arts and culture, and more. Always with data first, and always with an interdisciplinary lens.</p>
            <p>Visit every month to see what’s new!</p>
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

