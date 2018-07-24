import React from 'react';
import PropTypes from 'prop-types';

mapboxgl.accessToken = 'pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg';


class MapBox extends React.Component {

  componentDidMount() {
    this.map = new mapboxgl.Map({
      ...{
        container: this.mapContainer,
        style: 'mapbox://styles/ihill/cjjyl8uj509sj2smehs79fzyq',
        center: [-72, 42.36],
        maxBounds: [[-75.6, 41], [-69.5, 43.1]],
        zoom: 7,
        minZoom: 7,
        maxZoom: 11,
      },
      ...this.props,
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

MapBox.propTypes = {
  style: PropTypes.string,
  center: PropTypes.arrayOf(PropTypes.number),
  maxBounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  zoom: PropTypes.number,
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number,
};

export default MapBox;
