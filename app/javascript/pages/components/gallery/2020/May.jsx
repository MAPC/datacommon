/* eslint-disable max-len */
import React from 'react';
import * as d3 from 'd3';
import mapboxgl from 'mapbox-gl';
import alternativeShelter from '../../../assets/images/alternative-shelter.svg';
import CallToAction from '../../partials/CallToAction';

mapboxgl.accessToken = 'pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg';

const May = () => {
  d3.csv('/assets/may2020__shelters.csv').then((response) => {
    const geojsonForShelters = {
      type: 'FeatureCollection',
      name: 'alternativeShelters',
      crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
      features: [],
    };
    response.forEach((row) => {
      const entry = { type: 'Feature', properties: { Name: row['Facility Name'], Contact: row.Contact }, geometry: { type: 'Point', coordinates: [+row.Longitude, +row.Latitude] } };
      geojsonForShelters.features.push(entry);
    });

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
      maxZoom: 16,
      center,
      maxBounds: [
        [-74.728, 38.167], // Southwest bound
        [-66.541, 46.032], // Northeast bound
      ],
      style: 'mapbox://styles/ihill/ck92yirkh2mt71ho83t7y60m9',
    });

    mayMap.on('load', () => {
      mayMap.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
      mayMap.resize();
      mayMap.addLayer({
        id: 'Testing Centers',
        type: 'circle',
        source: {
          type: 'geojson',
          data: 'https://services1.arcgis.com/TXaY625xGc0yvAuQ/arcgis/rest/services/Test_Sites_Public/FeatureServer/0/query?where=OBJECTID_1+%3D+OBJECTID_1&outfields=*&f=pgeojson',
        },
        paint: {
          'circle-color': '#FFFFFF',
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#03332D',
        },
      });

      mayMap.addSource('alternativeShelters', {
        type: 'geojson',
        data: geojsonForShelters,
        cluster: true,
        clusterMaxZoom: 13, // Max zoom to cluster points on
        clusterRadius: 30, // Radius of each cluster when clustering points (defaults to 50)
      });
      mayMap.addLayer({
        id: 'Alternative Shelter clusters',
        type: 'symbol',
        source: 'alternativeShelters',
        filter: ['has', 'point_count'],
        layout: {
          'icon-image': 'alternative-shelter',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
          'icon-offset': [0, 5],
          'icon-size': ['step', ['get', 'point_count'], 0.75, 7, 1, 15, 1.25],
        },
      });
      mayMap.addLayer({
        id: 'Alternative Shelter cluster count',
        type: 'symbol',
        source: 'alternativeShelters',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 14,
        },
        paint: {
          'text-color': '#03332D',
        },
      });
      mayMap.addLayer({
        id: 'Unclustered Alternative Shelter',
        type: 'symbol',
        source: 'alternativeShelters',
        filter: ['!', ['has', 'point_count']],
        layout: {
          'icon-image': 'alternative-shelter',
          'icon-size': 0.5,
          'icon-allow-overlap': true,
        },
      });

      ['Alternative Shelter clusters', 'Alternative Shelter cluster count', 'Unclustered Alternative Shelter', 'Testing Centers'].forEach((layer) => {
        mayMap.on('mouseenter', layer, () => {
          mayMap.getCanvas().style.cursor = 'pointer';
        });
        mayMap.on('mouseleave', layer, () => {
          mayMap.getCanvas().style.cursor = '';
        });
      });

      mayMap.on('click', 'Unclustered Alternative Shelter', (e) => {
        const title = e.features[0].properties.Name !== '' ? `<p class='tooltip__title'>${e.features[0].properties.Name}</p>` : `<p class='tooltip__title'>${e.features[0].properties.Address}</p>`;
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(title)
          .addTo(mayMap);
      });

      mayMap.on('click', 'Testing Centers', (e) => {
        const title = e.features[0].properties.name !== '' ? `<p class='tooltip__title'>${e.features[0].properties.name}</p>` : `<p class='tooltip__title'>${e.features[0].properties.fulladdr}</p>`;
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(title)
          .addTo(mayMap);
      });

      mayMap.on('click', 'Alternative Shelter clusters', (e) => {
        const features = mayMap.queryRenderedFeatures(e.point, {
          layers: ['Alternative Shelter clusters'],
        });
        const clusterId = features[0].properties.cluster_id;
        mayMap.getSource('alternativeShelters').getClusterExpansionZoom(
          clusterId,
          (err, zoomIn) => {
            if (err) return;
            mayMap.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoomIn,
            });
          },
        );
      });
    });
  });
  return (
    <>
      <h1 className="calendar-viz__title">Responding to COVID-19</h1>
      <div className="calendar-viz__wrapper">
        <div id="mayMap" className="mapboxgl__container" />
        <div className="map__overlay" style={{ top: '98px' }}>
          <svg height="170" width="160" className="map__legend map__legend--translucent">
            <image href={alternativeShelter} height="20" width="20" x="7" y="14" />
            <text x="32" y="22" className="map__legend-entry" fill="#1F4E46">Alternative shelter/</text>
            <text x="32" y="36" className="map__legend-entry" fill="#1F4E46">isolation center</text>
            <circle cx="17" cy="52" r="4" stroke="#03332D" strokeWidth="1" fill="white" />
            <text x="32" y="56" className="map__legend-entry" fill="#1F4E46">Testing center</text>
            <text x="8" y="76" className="map__legend-entry map__legend-entry--bold" fill="#1F4E46">Explore & Download</text>
            <text x="8" y="90" className="map__legend-entry map__legend-entry--bold" fill="#1F4E46">Data</text>
            <text x="8" y="110" className="map__legend-entry" fill="#03332D">
              &#8226;
              {' '}
              <a href="https://memamaps.maps.arcgis.com/sharing/rest/content/items/1c7c77eefb544d108d51372d83131dcc/data" className="calendar-viz__link" fill="#1F4E46">COVID-19 testing sites</a>
            </text>
            <text x="8" y="124" className="map__legend-entry" fill="#1F4E46">
              &#8226;
              {' '}
              <a href="https://mapc365.sharepoint.com/:x:/s/DataServicesSP/ET8f2yfgFPRLjQ2YDhIhWGQB_azsNvGzPC-IR539rVymFA?e=wDc9MR" className="calendar-viz__link" fill="#1F4E46">Alternative shelters</a>
            </text>
            <text x="8" y="138" className="map__legend-entry" fill="#1F4E46">
              &#8226;
              {' '}
              <a href="https://www.mass.gov/info-details/archive-of-covid-19-cases-in-massachusetts" className="calendar-viz__link" fill="#1F4E46">Massachusetts</a>
            </text>
            <text x="15" y="152" className="map__legend-entry" fill="#1F4E46">
              <a href="https://www.mass.gov/info-details/archive-of-covid-19-cases-in-massachusetts" className="calendar-viz__link" fill="#1F4E46">COVID-19 dashboards</a>
            </text>
          </svg>
        </div>
      </div>
      <p>In the weeks since the COVID-19 emergency began, municipalities across the Commonwealth have been ramping up testing capacity as quickly as possible. As of April 30, the number of COVID-19 testing centers in Massachusetts has increased to 114. Sixty-five of those centers are located in 36 municipalities in our region, primarily concentrated in the Inner Core.</p>
      <p>With the expansion of testing, the number of confirmed cases grew – both because of the virus’s spread, and because of the increased rate of case identification. And with the concentration of testing in the Inner Core communities came a spike in confirmed cases among those with nowhere to quarantine themselves. Among these numbers are those who live in overcrowded places, those who live in close quarters with immunocompromised family members or housemates, and those who are homeless.</p>
      <p>Existing shelters have found themselves in a conundrum: while the necessity for safe shelter is greater than ever, bed capacities often must be lowered to keep facilities compliant with physical distancing guidelines.</p>
      <p>In response, institutions such as hotels and universities are partnering with municipalities and public health organizations to provide extra alternative shelters and isolation centers. Some are focusing on depopulating existing overcrowded shelters; others serve primarily to house first responders and front-line staff who cannot safely return to their primary residences. As Massachusetts undergoes the peak of infections, these sites will only become more necessary, and additional sites may be needed.</p>
      <p>
        <a href="https://mapc365.sharepoint.com/:x:/s/DataServicesSP/ET8f2yfgFPRLjQ2YDhIhWGQB_azsNvGzPC-IR539rVymFA?e=wDc9MR" className="calendar-viz__link">This spreadsheet</a>
        {' '}
contains all of the alternative shelters and isolation centers displayed on the map, while testing centers as collected by the Massachusetts Emergency Management Agency can be found
        {' '}
        <a href="https://memamaps.maps.arcgis.com/sharing/rest/content/items/1c7c77eefb544d108d51372d83131dcc/data" className="calendar-viz__link">here</a>
. Because COVID-19’s impacts on our region and commonwealth are evolving every day, some facilities may be missing. If you know of an alternative shelter or isolation center that should be included, please reach out to Barry Keppard at
        {' '}
        <a href="mailto:bkeppard@mapc.org" className="calendar-viz__link">bkeppard@mapc.org</a>
. If a testing center is missing or misrepresented, you can submit a change suggestion through
        {' '}
        <a href="https://survey123.arcgis.com/share/1abc65a9f8024a3a93eeb0bee98fd2a5" className="calendar-viz__link">this form</a>
.
      </p>
      <CallToAction
        link="https://www.mapc.org/resource-library/covid-19-resources/"
        text="View more MAPC COVID-19 resources"
        isDefaultLength={false}
        extraClassNames="calendar-viz__cta"
      />
    </>
  );
};

export default May;
