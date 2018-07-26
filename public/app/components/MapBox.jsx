import React from 'react';
import PropTypes from 'prop-types';

import colors from '~/app/constants/colors';

mapboxgl.accessToken = 'pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg';


class MapBox extends React.Component {

  constructor() {
    super(...arguments) ;

    this.addLayer = this.addLayer.bind(this);
  }


  addLayer(layer = null) {
    if (layer && !this.map.getSource(`ma-${layer.type}`)) {
      this.map.addLayer({
        id: `ma-${layer.type}`,
        type: layer.type,
        source: {
          type: 'geojson',
          data: layer.geojson,
        },
        paint: {
          [`${layer.type}-color`]: colors.BRAND.PRIMARY,
        },
      });
    }
  }


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

      if (this.props.layers) {
        this.props.layers.forEach(this.addLayer);
      }
    });
  }


  componentWillUnmount() {
    this.map.remove();
  }


  componentDidUpdate() {
    if (this.props.layers) {
      this.props.layers.forEach(layer => {
        if (layer) {
          var source = this.map.getSource(`ma-${layer.type}`);

          if (source) {
            source.setData(layer.geojson);
          }
          else {
            this.addLayer(layer);
          }
        }
      });
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
  layers: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.required,
    geojson: PropTypes.object.required,
  })),
};

export default MapBox;

