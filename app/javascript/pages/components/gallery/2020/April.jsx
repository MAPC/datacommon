import React from 'react';
import * as d3 from 'd3';
import mapboxgl from 'mapbox-gl';
import tempTractData from '../../../assets/data/MA-tract-return-rate.csv';
mapboxgl.accessToken = 'pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg';

const April = () => {
  d3.csv(tempTractData)
    .then(() => {
      const map = new mapboxgl.Map({
        container: 'map',
        zoom: 8,
        minZoom: 6,
        maxZoom: 13,
        center: [-70.986, 42.413],
        maxBounds: [
          [-74.728, 38.167], // Southwest bound
          [-66.541, 46.032], // Northeast bound
        ],
        style: 'mapbox://styles/ihill/ck5sc5wql2ezb1imqyu8a1miu/draft',
        accessToken: mapboxgl.accessToken,
        hash: true,
      });
    });
  return (
    <div id="map" className="map__container calendar-viz__map" />
  );
};

export default April;
