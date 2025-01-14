import React from "react";
import PropTypes from "prop-types";
import colors from "../constants/colors";
import mapcRegions from "../data/mapc-regions.json";
mapboxgl.accessToken =
  "pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg";

class MapBox extends React.Component {
  constructor() {
    super(...arguments);

    this.addLayer = this.addLayer.bind(this);
    this.toggleLayer = this.toggleLayer.bind(this);
    this.state = {
      finishedLoading: false,
      showMapcRegions: false,
    };
  }

  addLayer(layer = null) {
    if (layer && !this.map.getSource(`ma-${layer.type}`)) {
      this.map.addSource(`ma-${layer.type}`, {
        type: "geojson",
        data: layer.geojson,
        generateId: true,
      });

      this.map.addLayer({
        id: `ma-${layer.type}`,
        type: layer.type,
        source: `ma-${layer.type}`,
        paint:
          layer.type === "fill"
            ? {
                "fill-color": colors.BRAND.PRIMARY,
                "fill-opacity": 0.7,
              }
            : layer.type === ""
            ? {
                "line-color": colors.BRAND.PRIMARY,
                /*               'line-color': [
                'case',
                ['in', ['get', 'town'], ['literal', ['BOSTON', 'CAMBRIDGE']]],  // Replace with your town IDs
                '#FF0000',  // Color for highlighted borders
                colors.BRAND.PRIMARY  // Color for normal borders
              ] */
              }
            : {
                // Default paint properties for other layer types
                "line-color": colors.BRAND.PRIMARY,
                "line-width": 1,
              },
      });
    }
  }
  toggleLayer() {
    this.setState(
      (prevState) => ({
        showMAPCRegions: !prevState.showMAPCRegions,
      }),
      () => {
        // Toggle layer visibility after state update
        if (this.map) {
          this.map.setLayoutProperty(
            "mapc-region-line",
            "visibility",
            this.state.showMAPCRegions ? "visible" : "none"
          );
        }
      }
    );
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/ihill/ckeucj9gy9vt319qm4dxcn73l",
      scrollZoom: false,
      dragPan: false,
      dragRotate: false,
      doubleClickZoom: false,
      boxZoom: false,
      interactive: false,
      ...this.props,
    });

    this.map.fitBounds(
      [
        [-73.5081481933594, 41.1863288879395],
        [-69.8615341186523, 42.8867149353027],
      ],
      {
        padding: { top: 30, left: 300, right: 30, bottom: 30 },
        animate: false,
      }
    );

    this.map.on("load", () => {
      this.map.resize();
      window.map = this.map;
      // Create a transparent layer for hover and click detection
      // This layer covers the entire polygon area of each municipality
      if (this.props.muniPoly) {
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
            "fill-opacity": 0, // Transparent layer for interaction detection
          },
        });
      }
      this.map.addSource("mapc-region", {
        type: "geojson",
        data: mapcRegions,
      });
      this.map.addLayer({
        id: "mapc-region-line",
        type: "fill",
        source: "mapc-region",
        layout: {
          visibility: "none", // Hidden by default
        },
        paint: {
          "fill-color": "#006400",
          "fill-opacity": 0.7,
        },
      });
      
      if (this.props.layers) {
        this.props.layers.forEach(this.addLayer);
      }

      this.setState({ finishedLoading: true });
    });

    this.map.on("mousemove", "hover-fill", (e) => {
      if (e.features.length) {
        const feature = e.features[0];
        this.map.getCanvas().style.cursor = "pointer";

        if (!this.props.muniPoly || !this.props.muniPoly.features) {
          console.warn("Municipality data not available");
          return;
        }

        const hoveredFeature = this.props.muniPoly.features.find(
          (f) =>
            f.properties.town.toLowerCase() ===
            feature.properties.town.toLowerCase()
        );

        if (hoveredFeature) {
          const source = this.map.getSource("ma-fill");
          if (source) {
            source.setData({
              type: "FeatureCollection",
              features: [hoveredFeature],
            });
          }
        }
      }
    });

    this.map.on("mouseleave", "hover-fill", () => {
      this.map.getCanvas().style.cursor = "";

      const source = this.map.getSource("ma-fill");
      if (source) {
        source.setData({
          type: "FeatureCollection",
          features: [],
        });
      }
    });

    this.map.on("click", "hover-fill", (e) => {
      if (e.features.length) {
        const feature = e.features[0];
        const muniName = feature.properties.town
          .toLowerCase()
          .replace(/\s+/g, "-");
        if (this.props.toProfile) {
          this.props.toProfile(muniName);
        }
      }
    });
  }

  componentDidUpdate() {
    if (this.state.finishedLoading && this.props.layers) {
      this.props.layers.forEach((layer) => {
        if (layer) {
          var source = this.map.getSource(`ma-${layer.type}`);

          if (source) {
            source.setData(layer.geojson);
          } else {
            this.addLayer(layer);
          }
        }
      });
    }
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    return (
      <section className="component MapBox">
        {/* Add layer toggle switch */}
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
        <div className="map-layer" ref={(el) => (this.mapContainer = el)} />
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
      type: PropTypes.string.required,
      geojson: PropTypes.object.required,
    })
  ),
  muniPoly: PropTypes.object,
  toProfile: PropTypes.func,
};

export default MapBox;
