/* eslint-disable max-len */
import React from 'react';
import * as d3 from 'd3';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg';
const colors = ['#F15B52', '#F37871', '#F8B4B0', '#FBD2CF', '#F0EFE7'];
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
      } if (value >= 25) {
        return colors[0];
      } if (value >= 15) {
        return colors[1];
      } if (value >= 5) {
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
        const withoutComputers = 100 - +row.hascomp
        choropleth.push(row.tractID, colorScale(withoutComputers));
        percentageCompOwnership[row.tractID] = withoutComputers;
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
          ? `${d3.format('.1f')(percentageCompOwnership[tractId])}% (&#177; ${compMarginOfError[tractId]}%) of approx. ${d3.format(',')(numHouseholds[tractId])} households`
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
            <text x="10" y="22" className="map__legend-entry map__legend-entry--bold" fill="#1F4E46">Households without a</text>
            <text x="10" y="40" className="map__legend-entry map__legend-entry--bold" fill="#1F4E46">computer</text>
            <rect x="10" y="54" width="16" height="16" style={{ fill: colors[0], stroke: 'black', strokeWidth: '1px' }} />
            <text x="32" y="65" className="map__legend-entry" fill="#1F4E46">25 – 35%</text>
            <rect x="10" y="82" width="16" height="16" style={{ fill: colors[1], stroke: 'black', strokeWidth: '1px' }} />
            <text x="32" y="93" className="map__legend-entry" fill="#1F4E46">15 – 25%</text>
            <rect x="10" y="110" width="16" height="16" style={{ fill: colors[2], stroke: 'black', strokeWidth: '1px' }} />
            <text x="32" y="122" className="map__legend-entry" fill="#1F4E46">5 – 15%</text>
            <rect x="10" y="138" width="16" height="16" style={{ fill: colors[3], stroke: 'black', strokeWidth: '1px' }} />
            <text x="32" y="150" className="map__legend-entry" fill="#1F4E46">0 – 5%</text>
            <rect x="10" y="166" width="16" height="16" style={{ fill: colors[4], stroke: 'black', strokeWidth: '1px' }} />
            <text x="32" y="178" className="map__legend-entry" fill="#1F4E46">Data unavailable</text>
            <rect x="10" y="194" width="16" height="16" style={{ fill: 'white', stroke: 'black', strokeWidth: '1px' }} />
            <line x1="10" y1="202" x2="18" y2="194" style={{ stroke: '#2C110F', strokeWidth: '2px' }} />
            <line x1="10" y1="210" x2="26" y2="194" style={{ stroke: '#2C110F', strokeWidth: '2px' }} />
            <line x1="18" y1="210" x2="26" y2="202" style={{ stroke: '#2C110F', strokeWidth: '2px' }} />
            <text x="32" y="207" className="map__legend-entry" fill="#1F4E46">Hard to count tract</text>
          </svg>
        </div>
      </div>
      <p>The COVID-19 pandemic has upended daily life in Greater Boston and around the world. Thousands of people can’t report to work, and millions are being told to cease nonessential travel. Never before has the internet been so essential for working remotely and staying connected with families, friends, and doctors. Unfortunately, ten percent of the region’s households still lack a computer or smartphone needed to access the internet from their home. Not only does this inequity make it harder for people to get the information and socialization they need to make it through this crisis; it will also impact the decennial US Census being conducted this month.</p>
      <p>While the Census might seem extraneous to some people right now, it is of utmost importance to the functioning of government, including preparation for future public emergencies. Census counts determine legislative apportionment and districts; are the basis for federal funding allocation; and inform innumerable policy, planning, emergency response, and business decisions.</p>
      <p>Even with this year’s new option to answer the Census online, getting every household to respond is a tough job. This is especially true in so-called “hard-to-count” communities where limited English proficiency, immigration status, nontraditional housing arrangements, and distrust of government, among other factors, are formidable barriers to getting a complete count. Census promotion, outreach, and follow-up efforts are often focused on these neighborhoods to ensure they get counted fairly.</p>
      <p>The current need for “social distancing” creates a whole new set of challenges for complete count efforts. Many municipalities and community-based organizations had planned extensive personal outreach—events, door knocking, census parties, census kiosks—to promote census response. All of these in-person efforts have been cancelled as a result of the pandemic.</p>
      <p>Like many jobs, these efforts can’t all be shifted to online activities. As shown on the map, hard-to-count tracts often correspond to those lacking the technology needed to access the internet. In some neighborhoods, over 30 percent of households do not have so much as a smartphone. This will make it hard to reach households with online advertising promoting census response, and these same households will have to wait for a paper form rather than responding online.</p>
      <p>Along with all the other headwinds discouraging a complete count—the citizenship question, underfunding of Census outreach efforts, and lack of federal leadership, the digital divide may depress return rates among the most at-risk communities, with long term effects on funding, services, and representation.</p>
      <p>As a result, it’s more critical than ever for people to respond promptly to the Census so that follow-up efforts can be focused on communities that need it. This situation also highlights that as the current pandemic accelerates our transformation into being a more digital region, it is critical to pay attention to equity of access to the online world.</p>
    </>
  );
};

export default April;
