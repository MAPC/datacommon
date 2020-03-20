/* eslint-disable max-len */
import React from 'react';
import * as d3 from 'd3';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg';
const colors = ['#FBD2CF', '#F8B4B0', '#F37871', '#F15B52', '#F0EFE7'];
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
      if (isNaN(value)) {
        return colors[4];
      } if (value >= 95) {
        return colors[0];
      } if (value >= 85) {
        return colors[1];
      } if (value >= 75) {
        return colors[2];
      }
      return colors[3];
    };
    aprilMap.on('load', () => {
      aprilMap.setPaintProperty('background', 'background-color', '#FBF9EE');
      aprilMap.setPaintProperty('Non MAPC municipalities', 'fill-color', '#FBF9EE');
      aprilMap.setPaintProperty('External State', 'fill-color', '#FBF9EE');
      const choropleth = ['match', ['get', 'ct10_id']];
      const responseRate = ['match', ['get', 'ct10_id']];
      const responseRateOpacity = ['match', ['get', 'ct10_id']];
      const percentageCompOwnership = {};
      const compMarginOfError = {};
      const numHouseholds = {};

      response[0].forEach((row) => {
        choropleth.push(row.tractID, colorScale(+row.hascomp));
        percentageCompOwnership[row.tractID] = row.hascomp;
        numHouseholds[row.tractID] = row['Total Households'];
        compMarginOfError[row.tractID] = row.HasCompMOE;
      });

      response[1].forEach((row) => {
        responseRate.push(row.tractID, +row.MailReturnRateCen2010 <= 73 ? 'Pattern_Hatching_Brown' : 'blank');
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
        const tractData = percentageCompOwnership[tractId] <= 100
          ? `${percentageCompOwnership[tractId]}% (&#177; ${compMarginOfError[tractId]}%) of approx. ${d3.format(',')(numHouseholds[tractId])} households`
          : 'Data unavailable';
        const tooltipText = `<p class='tooltip__title'>Tract ${tractId}
        (${clickedData[2].properties.municipal})</p>
        ${tractData}`;
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(tooltipText)
          .addTo(aprilMap);
      });
    });
  });
  return (
    <>
      <h1 className="calendar-viz__title">The Digital Census</h1>
      <div id="aprilMap" className="map calendar-viz__mapbox">
        <div className="map__overlay">
          <svg height="220" width="160" className="map__legend map__legend--translucent">
            <text x="10" y="22" className="map__legend-entry map__legend-entry--bold" fill="#1F4E46">Households with 1+</text>
            <text x="10" y="40" className="map__legend-entry map__legend-entry--bold" fill="#1F4E46">computing devices</text>
            <rect x="10" y="54" width="16" height="16" style={{ fill: colors[3], stroke: 'black', strokeWidth: '1px' }} />
            <text x="32" y="65" className="map__legend-entry" fill="#1F4E46">65 – 75%</text>
            <rect x="10" y="82" width="16" height="16" style={{ fill: colors[2], stroke: 'black', strokeWidth: '1px' }} />
            <text x="32" y="93" className="map__legend-entry" fill="#1F4E46">75 – 85%</text>
            <rect x="10" y="110" width="16" height="16" style={{ fill: colors[1], stroke: 'black', strokeWidth: '1px' }} />
            <text x="32" y="122" className="map__legend-entry" fill="#1F4E46">85 – 95%</text>
            <rect x="10" y="138" width="16" height="16" style={{ fill: colors[0], stroke: 'black', strokeWidth: '1px' }} />
            <text x="32" y="150" className="map__legend-entry" fill="#1F4E46">95 – 100%</text>
            <rect x="10" y="166" width="16" height="16" style={{ fill: colors[4], stroke: 'black', strokeWidth: '1px' }} />
            <text x="32" y="178" className="map__legend-entry" fill="#1F4E46">Data unavailable</text>
            <rect x="10" y="194" width="16" height="16" style={{ fill: colors[4], stroke: 'black', strokeWidth: '1px' }} />
            <line x1="10" y1="202" x2="18" y2="194" style={{ stroke: '#2C110F', strokeWidth: '2px' }} />
            <line x1="10" y1="210" x2="26" y2="194" style={{ stroke: '#2C110F', strokeWidth: '2px' }} />
            <line x1="18" y1="210" x2="26" y2="202" style={{ stroke: '#2C110F', strokeWidth: '2px' }} />
            <text x="32" y="207" className="map__legend-entry" fill="#1F4E46">Hard to count tract</text>
          </svg>
        </div>
      </div>
      <p>usto nec ultrices dui sapien eget mi proin sed libero enim sed faucibus turpis in eu mi bibendum neque egestas congue quisque egestas diam in arcu cursus euismod quis viverra nibh cras pulvinar mattis nunc sed blandit libero volutpat sed cras ornare arcu dui vivamus arcu felis bibendum ut tristique et egestas quis ipsum suspendisse ultrices gravida dictum fusce ut placerat orci nulla pellentesque dignissim enim sit amet venenatis urna cursus eget nunc scelerisque</p>
      <p>viverra mauris in aliquam sem fringilla ut morbi tincidunt augue interdum velit euismod in pellentesque massa placerat duis ultricies lacus sed turpis tincidunt id aliquet risus feugiat in ante metus dictum at tempor commodo ullamcorper a lacus vestibulum sed arcu non odio euismod lacinia at quis risus sed vulputate odio ut enim blandit volutpat maecenas volutpat blandit aliquam etiam erat velit scelerisque in dictum non consectetur a erat nam at lectus urna duis convallis convallis tellus id interdum velit laoreet id donec ultrices tincidunt arcu non sodales neque sodales ut etiam sit amet nisl purus in mollis nunc sed id semper risus in hendrerit gravida rutrum quisque non tellus orci ac auctor augue mauris augue neque gravida in fermentum et sollicitudin ac orci phasellus egestas tellus rutrum tellus pellentesque eu tincidunt</p>
      <p>tortor aliquam nulla facilisi cras fermentum odio eu feugiat pretium nibh ipsum consequat nisl vel pretium lectus quam id leo in vitae turpis massa sed elementum tempus egestas sed sed risus pretium quam vulputate dignissim suspendisse in est ante in nibh mauris cursus mattis molestie a iaculis at erat pellentesque adipiscing commodo elit at imperdiet dui accumsan sit amet nulla facilisi morbi tempus iaculis urna id volutpat lacus laoreet non curabitur gravida arcu ac tortor dignissim convallis aenean et tortor at risus viverra adipiscing at in tellus integer feugiat scelerisque varius morbi enim nunc faucibus a pellentesque sit amet porttitor eget dolor morbi non arcu risus quis varius quam quisque id diam vel quam elementum pulvinar etiam non quam lacus suspendisse faucibus interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit duis tristique sollicitudin nibh sit amet commodo nulla facilisi nullam vehicula ipsum a</p>
    </>
  );
};

export default April;
