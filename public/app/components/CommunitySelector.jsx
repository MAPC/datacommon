import React from 'react';

mapboxgl.accessToken = 'pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg';

class CommunitySelector extends React.Component {

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/ihill/cjjyl8uj509sj2smehs79fzyq',
      center: [-72, 42.36],
      maxBounds: [[-75.6, 41], [-69.5, 43.1]],
      zoom: 7,
      minZoom: 7,
      maxZoom: 11,
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
