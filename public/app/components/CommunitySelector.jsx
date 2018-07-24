import React from 'react';

import MapBox from './MapBox';
import munis from '~/assets/data/ma-munis';
import colors from '~/app/constants/colors';


class CommunitySelector extends React.Component {

  constructor() {
    super(...arguments);

    munis.features.forEach(feature => feature.properties.color = colors.BRAND.PRIMARY);

    this.state = {
      munis,
      query: '',
    };

    this.applyFilter = this.applyFilter.bind(this);
  }


  applyFilter() {
  }


  render() {
    return (
      <section className="component CommunitySelector">
        <div className="search-box">
        </div>

        <MapBox
          features={[this.state.munis]}
        />
      </section>
    );
  }

}

export default CommunitySelector;
