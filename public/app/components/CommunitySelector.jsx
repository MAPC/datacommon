import React from 'react';

import MapBox from './MapBox';
import munis from '~/assets/data/ma-munis';
import colors from '~/app/constants/colors';
import SearchBar from '~/app/containers/SearchBar';


class CommunitySelector extends React.Component {

  constructor() {
    super(...arguments);

    munis.features.forEach(feature => feature.properties.color = colors.BRAND.PRIMARY);
  }

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
          features={this.props.munisPoly}
        />
      </section>
    );
  }

}

export default CommunitySelector;
