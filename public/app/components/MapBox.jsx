import React from 'react';
import PropTypes from 'prop-types';

import colors from '~/app/constants/colors';

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
      this.map.addLayer({
        id: 'ma',
        type: 'line',
        source: {
          type: 'geojson',
          data: this.props.features,
        },
        paint: {
          'line-color': ['get', 'lineColor'],
        },
      });
    });
  }

  componentWillUnmount() {
    this.map.remove();
  }

  componentDidUpdate() {
    const source = this.map.getSource('ma');

    console.log('checking');
    if (source) {
      console.log('Received');
      source.setData(this.props.features[0]);
    }
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
