import React from 'react';
import PropTypes from 'prop-types';

import Particles from './partials/Particles';
import SearchBar from '../containers/SearchBar';
import CategoryGrid from '../containers/CategoryGrid';
import CommunitySelector from '../containers/CommunitySelector';


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

        <div className="container tight page-section">
          <h2>Data by category</h2>

          <CategoryGrid />
        </div>

        <div className="page-section">
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

