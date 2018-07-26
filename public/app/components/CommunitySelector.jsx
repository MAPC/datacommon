import React from 'react';
import PropTypes from 'prop-types';

import MapBox from './MapBox';
import SearchBar from '~/app/containers/SearchBar';


class CommunitySelector extends React.Component {

  render() {
    return (
      <section className="component CommunitySelector">
        <div className="search-box">
          <SearchBar
            model={'municipality'}
            action={muni => this.props.toProfile(muni)}
            placeholder={'Search for a community ...'}
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
