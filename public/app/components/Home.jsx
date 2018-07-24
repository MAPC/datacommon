import React from 'react';

import Particles from './partials/Particles';
import SearchBar from '../containers/SearchBar';
import MuniSelect from '../containers/MuniSelect';
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
    window.location.pathname = `/browser/datasets/${dataset.id}`;
  }


  render() {
    return (
      <section className="route Home">

        <div className="page-header">
          <Particles />

          <div className="container tight">
            <SearchBar
              model={'dataset'}
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

export default Home;

