import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import Particles from './partials/Particles';
import SearchBar from '../containers/SearchBar';
import CategoryGrid from '../containers/CategoryGrid';
import CommunitySelector from '../containers/CommunitySelector';
import CallToAction from './partials/CallToAction';
import CalendarImage from '../assets/images/calendar-home.svg';

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
        <section className="page-section container gallery-spotlight__wrapper">
          <div className="gallery-spotlight__info">
            <p>Find and explore data visualizations about the region.  Check back monthly or sign up for our newsletter to receive maps and data visualizations.  We cover a range of vital and interrelated topics: equity, housing, transportation, climate, arts and culture, and more. Always with data first, and always with an interdisciplinary lens.</p>
            <p><strong>February’s visualization</strong> explores large housing units (3+ bedrooms) across the region.  This visualization uses the latest US Census data, available right here on DataCommon.  Dig deeper into this topic and explore the related MetroCommon report: Crowded In and Priced Out: Why It’s so Hard to Find a Family-Sized Unit in Greater Boston.</p>
            <CallToAction
              link="/gallery"
              text="Explore"
            />
          </div>
          <Link to="/gallery" className="gallery-spotlight__link">
            <img
              src={CalendarImage}
              className="gallery-spotlight__image"
              alt="gallery"
            />
          </Link>
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
