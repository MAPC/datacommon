/* eslint-disable max-len */
import React from 'react';
import * as d3 from 'd3';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg';
const colors = ['#481418', '#711E25', '#C93D4F', '#D7717F', '#C4C4BE'];

const April = () => {
  Promise.all([
    d3.csv('/assets/april2020.csv'),
    d3.csv('/assets/MA_2010_return_rates.csv'),
  ]).then((response) => {
    const aprilMap = new mapboxgl.Map({
      container: 'aprilMap',
      zoom: 8.4,
      minZoom: 6,
      maxZoom: 13,
      center: [-70.944, 42.37],
      maxBounds: [
        [-74.728, 38.167], // Southwest bound
        [-66.541, 46.032], // Northeast bound
      ],
      style: 'mapbox://styles/ihill/ck7qhmh0715wv1ilds1q8cb4z/draft',
    });
    const colorScale = (value) => {
      if (value >= 95) {
        return colors[0];
      } if (value >= 90) {
        return colors[1];
      } if (value >= 80) {
        return colors[2];
      }
      return colors[3];
    };
    aprilMap.on('load', () => {
      aprilMap.setPaintProperty('background', 'background-color', '#FDFAFD');
      aprilMap.setPaintProperty('Non MAPC municipalities', 'fill-color', '#FCF2FB');
      aprilMap.setPaintProperty('External State', 'fill-color', '#FCF2FB');
      const choropleth = ['match', ['get', 'ct10_id']];
      const responseRate = ['match', ['get', 'ct10_id']];
      const responseRateOpacity = ['match', ['get', 'ct10_id']];
      const percentageCompOwnership = {};

      response[0].forEach((row) => {
        choropleth.push(row.tractID, row.hascomp !== 'na' ? colorScale(+row.hascomp) : colors[4]);
        percentageCompOwnership[row.tractID] = row.hascomp;
      });

      response[1].forEach((row) => {
        responseRate.push(row.tractID, +row.MailReturnRateCen2010 <= 73 ? 'Pattern_Hatching_Gray' : 'blank');
        responseRateOpacity.push(row.tractID, +row.MailReturnRateCen2010 <= 73 ? 1 : 0);
      });

      choropleth.push(colors[4]);
      responseRate.push('black');
      responseRateOpacity.push(0);
      aprilMap.addLayer({
        id: 'Computer Ownership by Tract',
        type: 'fill',
        source: 'composite',
        'source-layer': 'Tracts-2jsl06',
        paint: {
          'fill-color': choropleth,
        },
      });

      aprilMap.addLayer({
        id: '2010 Response Rates',
        type: 'fill',
        source: 'composite',
        'source-layer': 'Tracts-2jsl06',
        paint: {
          'fill-pattern': responseRate,
        },
      });

      aprilMap.moveLayer('Computer Ownership by Tract', 'MAPC municipal borders');
      aprilMap.removeLayer('MAPC tract borders');

      aprilMap.on('click', 'MAPC tracts', (e) => {
        const clickedData = aprilMap.queryRenderedFeatures(
          [e.point.x, e.point.y],
          { layers: ['MAPC tracts', 'MAPC municipalities', 'Computer Ownership by Tract'] },
        );
        const tractId = clickedData[0].properties.ct10_id;
        const selectedCompOwnership = percentageCompOwnership[tractId] <= 100 ? `${percentageCompOwnership[tractId]}%` : 'Data unavailable';
        const tooltipText = `<p class='tooltip__title'>Tract ${tractId} `
        + `(${clickedData[2].properties.municipal})</p>`
        + `<p class='tooltip__text'>${selectedCompOwnership}`;
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(tooltipText)
          .addTo(aprilMap);
      });
    });
  });
  return (
    <>
      <h1 className="calendar-viz__title">Census 2020</h1>
      <div id="aprilMap" className="map calendar-viz__mapbox">
        <svg height="220" width="220" className="map__legend">
          <text x="10" y="12" className="map__legend-entry map__legend-entry--bold" fill="#1F4E46">Households with one or more</text>
          <text x="10" y="30" className="map__legend-entry map__legend-entry--bold" fill="#1F4E46">types of compting devices</text>
          <rect x="10" y="44" width="16" height="16" style={{ fill: colors[0], stroke: 'black', strokeWidth: '1px' }} />
          <text x="32" y="55" className="map__legend-entry" fill="#1F4E46">95 - 100%</text>
          <rect x="10" y="72" width="16" height="16" style={{ fill: colors[1], stroke: 'black', strokeWidth: '1px' }} />
          <text x="32" y="83" className="map__legend-entry" fill="#1F4E46">90 - 95%</text>
          <rect x="10" y="100" width="16" height="16" style={{ fill: colors[2], stroke: 'black', strokeWidth: '1px' }} />
          <text x="32" y="112" className="map__legend-entry" fill="#1F4E46">80 - 90%</text>
          <rect x="10" y="128" width="16" height="16" style={{ fill: colors[3], stroke: 'black', strokeWidth: '1px' }} />
          <text x="32" y="140" className="map__legend-entry" fill="#1F4E46">80% and below</text>
          <rect x="10" y="156" width="16" height="16" style={{ fill: colors[4], stroke: 'black', strokeWidth: '1px' }} />
          <text x="32" y="168" className="map__legend-entry" fill="#1F4E46">Data unavailable</text>
          <rect x="10" y="184" width="16" height="16" style={{ fill: colors[2], stroke: 'black', strokeWidth: '2px' }} />
          <line x1="10" y1="192" x2="18" y2="184" style={{ stroke: '#CFCECC', strokeWidth: '2px' }} />
          <line x1="10" y1="200" x2="26" y2="184" style={{ stroke: '#CFCECC', strokeWidth: '2px' }} />
          <line x1="18" y1="200" x2="26" y2="192" style={{ stroke: '#CFCECC', strokeWidth: '2px' }} />
          <text x="32" y="197" className="map__legend-entry" fill="#1F4E46">Hard to count tract</text>
        </svg>
      </div>
    </>
  );
};

export default April;
