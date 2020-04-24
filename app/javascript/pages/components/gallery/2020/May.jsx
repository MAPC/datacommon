/* eslint-disable max-len */
import React, { useEffect } from 'react';
import Papa from 'papaparse';
import mapboxgl from 'mapbox-gl';
import testingCenter from '../../../assets/images/testing-center.svg';
import alternativeShelter from '../../../assets/images/alternative-shelter.svg';

mapboxgl.accessToken = 'pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg';

const May = () => {
  useEffect(() => {
    let zoom = 8.4;
    let center = [-70.944, 42.37];
    if (window.innerWidth <= 480) {
      zoom = 7.75;
      center = [-71.043, 42.372];
    } else if (window.innerWidth <= 670) {
      zoom = 8.27;
      center = [-71.047, 42.377];
    } else if (window.innerWidth <= 770) {
      zoom = 8.4;
      center = [-71.039, 42.37];
    }
    const mayMap = new mapboxgl.Map({
      container: 'mayMap',
      zoom,
      minZoom: 6,
      maxZoom: 15,
      center,
      maxBounds: [
        [-74.728, 38.167], // Southwest bound
        [-66.541, 46.032], // Northeast bound
      ],
      style: 'mapbox://styles/ihill/ck92yirkh2mt71ho83t7y60m9/draft',
    });

    const addDataToMap = (sourceName, geojson, iconName) => {
      mayMap.addSource(sourceName, {
        type: 'geojson',
        data: geojson,
      });

      mayMap.addLayer({
        id: sourceName,
        type: 'symbol',
        source: sourceName,
        layout: {
          'icon-image': iconName,
          'icon-size': 1,
        },
      });
    };

    const loadDataPoints = () => {
      Papa.parse('https://docs.google.com/spreadsheets/d/e/2PACX-1vT4cTPo1GJnF8Wll4OOP-Ow-DaCQ3vsbKSS4oF3KUK2k-vEIwZHRamXr8lLN4BOPcv2yD5pFF0FyYiA/pub?gid=0&single=true&output=csv', {
        download: true,
        header: true,
        complete(results) {
          const { data } = results;
          const geojsonForTesting = {
            type: 'FeatureCollection',
            name: 'testingCenters',
            crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
            features: [],
          };
          data.forEach((row) => {
            const entry = { type: 'Feature', properties: { Name: row['Facility Name'], Contact: row.Contact }, geometry: { type: 'Point', coordinates: [+row.Longitude, +row.Latitude] } };
            geojsonForTesting.features.push(entry);
          });
          addDataToMap('testingCenters', geojsonForTesting, 'testing-center');
        },
      });

      Papa.parse('https://docs.google.com/spreadsheets/d/e/2PACX-1vT4cTPo1GJnF8Wll4OOP-Ow-DaCQ3vsbKSS4oF3KUK2k-vEIwZHRamXr8lLN4BOPcv2yD5pFF0FyYiA/pub?gid=1774213708&single=true&output=csv', {
        download: true,
        header: true,
        complete(results) {
          const { data } = results;
          const geojsonForShelters = {
            type: 'FeatureCollection',
            name: 'alternativeShelters',
            crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
            features: [],
          };
          data.forEach((row) => {
            const entry = { type: 'Feature', properties: { Name: row['Facility Name'], Contact: row.Contact, Address: row.Address }, geometry: { type: 'Point', coordinates: [+row.Longitude, +row.Latitude] } };
            geojsonForShelters.features.push(entry);
          });
          addDataToMap('alternativeShelters', geojsonForShelters, 'alternative-shelter');
        },
      });
    };

    mayMap.on('load', () => {
      loadDataPoints();
      mayMap.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
      mayMap.resize();
    });

    mayMap.on('click', 'alternativeShelters', (e) => {
      const title = e.features[0].properties.Name !== '' ? `<p class='tooltip__title'>${e.features[0].properties.Name}</p>` : `<p class='tooltip__title'>${e.features[0].properties.Address}</p>`;
      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(title)
        .addTo(mayMap);
    });

    mayMap.on('click', 'testingCenters', (e) => {
      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`<p class='tooltip__title'>${e.features[0].properties.Name}</p>`)
        .addTo(mayMap);
    });
  });

  return (
    <>
      <h1 className="calendar-viz__title">Responsing to COVID-19</h1>
      <div className="calendar-viz__wrapper">
        <div id="mayMap" className="mapboxgl__container" />
        <div className="map__overlay" style={{ top: '98px' }}>
          <svg height="140" width="160" className="map__legend map__legend--translucent">
            <image href={testingCenter} height="20" width="20" x="7" y="7" />
            <text x="32" y="22" className="map__legend-entry" fill="#1F4E46">Testing center</text>
            <image href={alternativeShelter} height="20" width="20" x="7" y="32" />
            <text x="32" y="47" className="map__legend-entry" fill="#1F4E46">Alternative shelter</text>
            <text x="8" y="75" className="map__legend-entry map__legend-entry--bold" fill="#1F4E46">Explore & Download</text>
            <text x="8" y="89" className="map__legend-entry map__legend-entry--bold" fill="#1F4E46">Data</text>
            <text x="8" y="105" className="map__legend-entry" fill="#1F4E46">
              &#8226;
              {' '}
              <a href="https://www.mass.gov/doc/ma-covid-19-testing-sites/download" className="calendar-viz__link" fill="#1F4E46">COVID-19 testing sites</a>
            </text>
            <text x="8" y="121" className="map__legend-entry" fill="#1F4E46">
              &#8226;
              {' '}
              <a href="https://docs.google.com/spreadsheets/d/1RYc2Y0wgjzt4liubLk_l631zUeAIz9ilCFHYNsthimU/edit?usp=sharing" className="calendar-viz__link" fill="#1F4E46">Alternative shelters</a>
            </text>
          </svg>
        </div>
      </div>
      <p>In the weeks since Governor Baker declared a state of emergency, municipalities across the region and commonwealth at large have been quickly assembling the necessary infrastructure to combat COVID-19. While most of MAPC’s work focuses on the Metropolitan Boston region, this is an all-hands-on-deck situation requiring extra cross-collaboration.</p>
      <p>Massachusetts assembled a list of 76 identified COVID-19 testing centers from across the entire state, spread over 59 municipalities. 45 of those centers are in 30 municipalities in our region, primarily in the Inner Core. These locations do require a clinician’s referral and an appointment, so if you believe you need a test, you should begin by contacting your primary health care provider.</p>
      <p>While “social distancing” has become a part of many of our daily vocabularies, there are some people in our region who do not have that luxury. People experiencing homelessness are particularly vulnerable to the effects of COVID-19, but also first responders and coronavirus patients requiring post-acute care. In addition to traditional shelters, other institutions across the commonwealth are stepping up to provide alternative shelters to those in need. Some universities and hotels have opened up dorms and rooms to serve as alternative shelters, and the Boston Convention and Exhibition Center has opened 1,000 beds for patients in recovery.</p>
      <p>
Additionally, residents are forming unofficial grassroots organizations to help their neighbors. As highlighted in an
        <a href="https://www.bostonglobe.com/2020/04/15/metro/you-are-not-alone-there-is-hope-coronavirus-outbreak-spreads-so-does-volunteerism/" className="calendar-viz__link">April 15 Boston Globe article</a>
, “mutual aid” groups such as Newton Neighbors Helping Newton Neighbors aim to connect vulnerable populations to volunteers offering to perform tasks such as grocery delivery.
      </p>
      <p>Governance in the time of COVID-19 is like nothing we have seen before, and unique problems require unique solutions. As the situation continues to evolve, the region and the commonwealth must continue to strive towards an equitable respsonse.</p>
      <p>Below is a spreadsheet representing the data on the above map. If your test center or alternative shelter is not displayed, please contact us.</p>
      <iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vT4cTPo1GJnF8Wll4OOP-Ow-DaCQ3vsbKSS4oF3KUK2k-vEIwZHRamXr8lLN4BOPcv2yD5pFF0FyYiA/pubhtml?widget=true&amp;headers=false" className="calendar-viz__spreadsheet" />
    </>
  );
};

export default May;
