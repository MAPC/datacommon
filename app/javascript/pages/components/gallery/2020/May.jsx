/* eslint-disable max-len */
import React from 'react';
import Papa from 'papaparse';
import mapboxgl from 'mapbox-gl';
import testingCenter from '../../../assets/images/testing-center.svg';
import alternativeShelter from '../../../assets/images/alternative-shelter.svg';

mapboxgl.accessToken = 'pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg';

const May = () => {
  window.addEventListener('DOMContentLoaded', () => {
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


    const loadDataPoints = () => {
      const geojsonForTesting = {
        type: 'FeatureCollection',
        name: 'testingCenters',
        crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
        features: [],
      };
      Papa.parse('https://docs.google.com/spreadsheets/d/e/2PACX-1vT4cTPo1GJnF8Wll4OOP-Ow-DaCQ3vsbKSS4oF3KUK2k-vEIwZHRamXr8lLN4BOPcv2yD5pFF0FyYiA/pub?gid=0&single=true&output=csv', {
        download: true,
        header: true,
        complete(results) {
          const { data } = results;
          data.forEach((row) => {
            const entry = { type: 'Feature', properties: { Name: row['Facility Name'], Contact: row.Contact }, geometry: { type: 'Point', coordinates: [+row.Longitude, +row.Latitude] } };
            geojsonForTesting.features.push(entry);
          });
        },
      });

      const geojsonForShelters = {
        type: 'FeatureCollection',
        name: 'alternativeShelters',
        crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
        features: [],
      };
      Papa.parse('https://docs.google.com/spreadsheets/d/e/2PACX-1vT4cTPo1GJnF8Wll4OOP-Ow-DaCQ3vsbKSS4oF3KUK2k-vEIwZHRamXr8lLN4BOPcv2yD5pFF0FyYiA/pub?gid=1774213708&single=true&output=csv', {
        download: true,
        header: true,
        complete(results) {
          const { data } = results;
          data.forEach((row) => {
            const entry = { type: 'Feature', properties: { Name: row['Facility Name'], Contact: row.Contact }, geometry: { type: 'Point', coordinates: [+row.Longitude, +row.Latitude] } };
            geojsonForShelters.features.push(entry);
          });
        },
      });

      setTimeout(() => {
        mayMap.addSource('testingCenters', {
          type: 'geojson',
          data: geojsonForTesting,
        });

        mayMap.addSource('alternativeShelters', {
          type: 'geojson',
          data: geojsonForShelters,
        });

        mayMap.addLayer({
          id: 'testingCenters',
          type: 'symbol',
          source: 'testingCenters',
          layout: {
            'icon-image': 'testing-center',
            'icon-size': 1,
          },
        });

        mayMap.addLayer({
          id: 'alternativeShelters',
          type: 'symbol',
          source: 'alternativeShelters',
          layout: {
            'icon-image': 'alternative-shelter',
            'icon-size': 1,
          },
        });
      }, 1000);
    };

    mayMap.on('load', () => {
      loadDataPoints();
      mayMap.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    });

    mayMap.on('click', 'alternativeShelters', (e) => {
      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`${e.features[0].properties.Name}`)
        .addTo(mayMap);
    });

    mayMap.on('click', 'testingCenters', (e) => {
      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`${e.features[0].properties.Name}`)
        .addTo(mayMap);
    });
  });

  return (
    <>
      <h1 className="calendar-viz__title">A Regional Response to COVID-19</h1>
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
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sollicitudin quam eu ligula faucibus, eu mollis metus elementum. Sed sit amet ligula quis arcu finibus pulvinar eget et risus. Sed lectus mi, ornare id vulputate nec, scelerisque vitae velit. Morbi lacus ante, pulvinar et augue sit amet, suscipit sagittis mauris. Nullam quis tincidunt neque, a luctus arcu. Morbi malesuada erat enim, id sollicitudin sem vestibulum a. Curabitur tempus orci turpis, ac pulvinar nisi aliquet vel. Duis feugiat eros eu felis elementum, in tempor purus lacinia. Nam nec vehicula urna. Morbi at mi nec metus ultrices tempor non eget risus. Maecenas in odio diam. Donec ligula magna, volutpat et ornare nec, varius nec felis.</p>
      <p>Nulla condimentum vel dolor mollis venenatis. Proin nec vestibulum purus. Nullam cursus ultricies euismod. Curabitur vulputate velit nisi, ac convallis nunc mollis sit amet. Donec turpis felis, lobortis vitae blandit et, eleifend eget justo. Nam pharetra vel massa at convallis. Quisque justo ipsum, elementum in tempus eu, gravida eget sapien. Curabitur tristique tincidunt massa. Maecenas magna eros, lobortis ut orci eget, ullamcorper porta purus. Curabitur ut maximus nisl.</p>
      <p>Proin velit eros, luctus quis velit eget, tempus suscipit eros. Aliquam vel turpis nisl. Ut facilisis lorem id sagittis vestibulum. Donec auctor mi massa, sit amet sagittis odio sodales at. Curabitur condimentum ex eu diam placerat accumsan. Praesent volutpat ex id urna tincidunt, in lobortis nisl porta. Vestibulum et erat sed dui vulputate ullamcorper at at nulla. Nam molestie rhoncus ex quis dictum.</p>
      <p>Duis quis rhoncus velit. Donec accumsan purus vel lectus egestas ultrices. Aliquam ac sodales mi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Curabitur elit est, sodales sed pellentesque a, gravida a purus. Donec finibus magna ac quam vulputate dictum. Aenean elementum elit nulla, pretium elementum odio feugiat vitae. Duis a facilisis ligula. Aliquam consectetur sed ante nec posuere. Maecenas volutpat mi at nunc placerat, sit amet molestie purus tincidunt. Sed id condimentum urna. Integer ut iaculis neque, nec malesuada ante. Pellentesque lorem mi, molestie vel dui ornare, commodo finibus sem. Mauris lorem ante, vehicula id purus et, ultrices eleifend justo.</p>
      <iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vT4cTPo1GJnF8Wll4OOP-Ow-DaCQ3vsbKSS4oF3KUK2k-vEIwZHRamXr8lLN4BOPcv2yD5pFF0FyYiA/pubhtml?widget=true&amp;headers=false" className="calendar-viz__spreadsheet" />
    </>
  );
};

export default May;
