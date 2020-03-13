/* eslint-disable max-len */
import React from 'react';
import * as d3 from 'd3';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg';
const colors = ['#5E0B15', '#90323D', '#AE6971', '#F7CD59', '#cda189'];

const April = () => {
  Promise.all([
    d3.csv('/assets/april2020.csv'),
    d3.csv('/assets/MA_2010_return_rates.csv'),
  ]).then((response) => {
    const aprilMap = new mapboxgl.Map({
      container: 'aprilMap',
      zoom: 8.6,
      minZoom: 6,
      maxZoom: 13,
      center: [-71.074, 42.362],
      maxBounds: [
        [-74.728, 38.167], // Southwest bound
        [-66.541, 46.032], // Northeast bound
      ],
      style: 'mapbox://styles/ihill/ck5sc5wql2ezb1imqyu8a1miu/draft',
    });
    const colorScale = (value) => {
      if (value > 90) {
        return colors[0];
      } if (value > 80) {
        return colors[1];
      } if (value > 70) {
        return colors[2];
      }
      return colors[3];
    };
    aprilMap.on('load', () => {
      const choropleth = ['match', ['get', 'ct10_id']];
      const choroplethMOE = ['match', ['get', 'ct10_id']];
      const responseRate = ['match', ['get', 'ct10_id']];
      const responseRateOpacity = ['match', ['get', 'ct10_id']];
      const percentageCompOwnership = {};

      response[0].forEach((row) => {
        choropleth.push(row.tractID, row.hascomp !== 'na' ? colorScale(+row.hascomp) : colors[4]);
        choroplethMOE.push(row.tractID, +row.moe >= 30 ? 'Pattern_Hatching_Gray' : 'blank');
        percentageCompOwnership[row.tractID] = row.hascomp;
      });

      response[1].forEach((row) => {
        responseRate.push(row.tractID, +row.MailReturnRateCen2010 <= 73 ? 'white' : 'black');
        responseRateOpacity.push(row.tractID, +row.MailReturnRateCen2010 <= 73 ? 1 : 0);
      });

      choropleth.push(colors[4]);
      choroplethMOE.push('blank');
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
        id: 'Choropleth Margin of Error',
        type: 'fill',
        source: 'composite',
        'source-layer': 'Tracts-2jsl06',
        paint: {
          'fill-pattern': choroplethMOE,
        },
      });

      aprilMap.addLayer({
        id: '2010 Response Rates',
        type: 'line',
        source: 'composite',
        'source-layer': 'Tracts-2jsl06',
        paint: {
          'line-color': responseRate,
          'line-opacity': responseRateOpacity,
          'line-dasharray': [2, 2],
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
      <div id="aprilMap" className="map calendar-viz__mapbox" />
      <div className="map__overlay map__legend" id="legend">
        <p>Households owning at least one computing device (laptop, smart phone, tablet, desktop, etc)</p>
        <svg height="168" width="220">
          <rect x="10" y="11" width="16" height="16" style={{ fill: colors[0], stroke: 'black', strokeWidth: '1px' }} />
          <text x="32" y="23" className="legend__label">90 - 100%</text>
          <rect x="10" y="39" width="16" height="16" style={{ fill: colors[1], stroke: 'black', strokeWidth: '1px' }} />
          <text x="32" y="50" className="legend__label">80 - 90%</text>
          <rect x="10" y="67" width="16" height="16" style={{ fill: colors[2], stroke: 'black', strokeWidth: '1px' }} />
          <text x="32" y="79" className="legend__label">70 - 80%</text>
          <rect x="10" y="95" width="16" height="16" style={{ fill: colors[3], stroke: 'black', strokeWidth: '1px' }} />
          <text x="32" y="107" className="legend__label">70% and below</text>
          <rect x="10" y="123" width="16" height="16" style={{ fill: colors[4], stroke: 'black', strokeWidth: '1px' }} />
          <text x="32" y="135" className="legend__label">Data unavailable</text>
        </svg>
        <p>White line indicates low response rate (68.8% and below) in 2010 census</p>
      </div>
    </>
  );
};

export default April;
