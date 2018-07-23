import React from 'react';

import mapboxgl from 'mapbox-gl';


mapboxgl.accessToken = 'pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg';

class CommunitySelector extends React.Component {

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/light-v9',
      centroid: [-71.0589, 42.3601],
      zoom: 12,
      inZoom: 12,
      maxZoom: 15,
    });

    this.map.on('load', () => {
      this.map.resize();
    });
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    return (
      <section className="component CommunitySelector">
        <div className="map-layer" ref={el => this.mapContainer = el} />
      </section>
    );
  }

}

export default CommunitySelector;
