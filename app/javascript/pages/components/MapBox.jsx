import React from "react";
import PropTypes from "prop-types";
import mapboxgl from 'mapbox-gl';
import { MAP_CONFIG } from '../constants/mapConfig';
import { setupMouseEvents } from '../utils/mapEventHandlers';
import { addMapLayer, updateMapLayers } from '../utils/layerManager';
import mapcRegions from "../data/mapc-regions.json";
import colors from "../constants/colors";

mapboxgl.accessToken = MAP_CONFIG.accessToken;

class MapBox extends React.Component {
  state = {
    finishedLoading: false,
    showMapcRegions: false,
  };

  componentDidMount() {
    this.initializeMap();
  }

  componentDidUpdate() {
    this.handleLayerUpdates();
  }

  componentWillUnmount() {
    this.map?.remove();
  }

  initializeMap() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: MAP_CONFIG.style,
      dragPan: false,
      dragRotate: false,
      ...this.props,
    });

    this.map.fitBounds(MAP_CONFIG.bounds, {
      padding: MAP_CONFIG.padding,
      animate: false,
    });

    this.map.addControl(
      new mapboxgl.NavigationControl(MAP_CONFIG.navigationControl),
      MAP_CONFIG.navigationControl.position
    );

    this.map.on("load", () => this.onMapLoad());
  }

  onMapLoad() {
    this.map.resize();
    window.map = this.map;
    
    this.initializeHoverLayer();
    this.initializeMAPCRegions();
    
    if (this.props.layers) {
      this.props.layers.forEach(layer => addMapLayer(this.map, layer));
    }

    setupMouseEvents(this.map, this.props.muniPoly, this.props.toProfile);
    this.setState({ finishedLoading: true });
  }

  initializeHoverLayer() {
    if (!this.props.muniPoly) return;

    this.map.addSource("hover-fill", {
      type: "geojson",
      data: this.props.muniPoly,
    });

    this.map.addLayer({
      id: "hover-fill",
      type: "fill",
      source: "hover-fill",
      paint: {
        "fill-color": colors.BRAND.PRIMARY,
        "fill-opacity": 0,
      },
    });
  }

  initializeMAPCRegions() {
    this.map.addSource("mapc-region", {
      type: "geojson",
      data: mapcRegions,
    });

    this.map.addLayer({
      id: "mapc-region-line",
      type: "fill",
      source: "mapc-region",
      layout: { visibility: "none" },
      paint: {
        "fill-color": "#006400",
        "fill-opacity": 0.7,
      },
    });
  }

  handleLayerUpdates() {
    if (this.state.finishedLoading && this.props.layers) {
      updateMapLayers(this.map, this.props.layers);
    }
  }

  toggleLayer = () => {
    this.setState(
      prevState => ({
        showMAPCRegions: !prevState.showMAPCRegions,
      }),
      () => {
        this.map?.setLayoutProperty(
          "mapc-region-line",
          "visibility",
          this.state.showMAPCRegions ? "visible" : "none"
        );
      }
    );
  };

  render() {
    return (
      <section className="component MapBox">
        <div className="map-controls">
          <div className="toggle-container">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={this.state.showMAPCRegions}
                onChange={this.toggleLayer}
              />
              <span className="slider"></span>
            </label>
            <div className="slider-text">Show MAPC regions</div>
          </div>
        </div>
        <div 
          className="map-layer" 
          ref={el => (this.mapContainer = el)} 
        />
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
  layers: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      geojson: PropTypes.object.isRequired,
    })
  ),
  muniPoly: PropTypes.object,
  toProfile: PropTypes.func,
};

export default MapBox;
