import React from 'react';
import PropTypes from 'prop-types';

import MapBox from './MapBox';
import SearchBar from '../containers/SearchBar';


class CommunitySelector extends React.Component {

  render() {
    return (
      <section className="component CommunitySelector">
        <div className="search-box">
          <h2>Community Profiles</h2>
          <p>Search any community in Massachusetts to view their profile:</p>

          <SearchBar
            contextKey={'municipality'}
            action={muni => this.props.toProfile(muni.replace(' ', '-'))}
            placeholder={'Search for a community ...'}
            className={"small"}
          />
        </div>

        <MapBox
          layers={[this.props.muniLines, this.props.muniFill]}
        />
      </section>
    );
  }

}


const layerShape = {
  type: PropTypes.string.isRequired,
  geojson: PropTypes.object.isRequired,
};

CommunitySelector.propTypes = {
  toProfile: PropTypes.func.isRequired,
  muniLines: PropTypes.shape(layerShape).isRequired,
  muniFill: PropTypes.shape(layerShape).isRequired,
};

export default CommunitySelector;
