import React from 'react';

import SearchBar from './SearchBar';
import Particles from './partials/Particles';
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
              action={selected => this.toDataset(selected)}
              query={this.props.datasetsQuery}
              items={this.props.datasets}
              results={this.props.datasetsResults}
              onSearch={(results, query) => this.props.storeDatasetSearchResults(results, query)}
              placeholder={`Search ${this.props.datasets.length} datasets ...`}
              searchColumn={'title'}
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

