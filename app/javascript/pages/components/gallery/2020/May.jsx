/* eslint-disable max-len */
import React, { useEffect } from 'react';
import Papa from 'papaparse';
import mapboxgl from 'mapbox-gl';
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
      maxZoom: 16,
      center,
      maxBounds: [
        [-74.728, 38.167], // Southwest bound
        [-66.541, 46.032], // Northeast bound
      ],
      style: 'mapbox://styles/ihill/ck92yirkh2mt71ho83t7y60m9/draft',
    });

    const mapShelterData = (sourceName, geojson, iconName) => {
      mayMap.addSource(sourceName, {
        type: 'geojson',
        data: geojson,
        cluster: true,
        clusterMaxZoom: 13, // Max zoom to cluster points on
        clusterRadius: 30, // Radius of each cluster when clustering points (defaults to 50)
      });

      mayMap.addLayer({
        id: 'Alternative Shelter clusters',
        type: 'symbol',
        source: sourceName,
        filter: ['has', 'point_count'],
        layout: {
          'icon-image': iconName,
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
          'icon-offset': [0, 5],
          'icon-size': [
            'step',
            ['get', 'point_count'],
            0.75,
            7,
            1,
            15,
            1.25,
          ],
        },
      });

      mayMap.addLayer({
        id: 'Alternative Shelter cluster count',
        type: 'symbol',
        source: sourceName,
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 14,
        },
        paint: {
          'text-color': 'white',
        },
      });

      mayMap.addLayer({
        id: 'Unclustered Alternative Shelter',
        type: 'symbol',
        source: sourceName,
        filter: ['!', ['has', 'point_count']],
        layout: {
          'icon-image': iconName,
          'icon-size': 0.5,
          'icon-allow-overlap': true,
        },
      });

      if (mayMap.getLayer('Testing Centers') && mayMap.getLayer('Alternative Shelter clusters')) {
        mayMap.moveLayer('Testing Centers', 'Alternative Shelter clusters');
      }

      mayMap.on('click', 'Alternative Shelter clusters', (e) => {
        const features = mayMap.queryRenderedFeatures(e.point, {
          layers: ['Alternative Shelter clusters'],
        });
        const clusterId = features[0].properties.cluster_id;
        mayMap.getSource(sourceName).getClusterExpansionZoom(
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
    };

    const mapTestingCenters = (sourceName, geojson) => {
      mayMap.addSource(sourceName, {
        type: 'geojson',
        data: geojson,
      });

      mayMap.addLayer({
        id: 'Testing Centers',
        type: 'circle',
        source: sourceName,
        paint: {
          'circle-color': '#03332D',
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff',
        },
      });
      if (mayMap.getLayer('Testing Centers') && mayMap.getLayer('Alternative Shelter clusters')) {
        mayMap.moveLayer('Testing Centers', 'Alternative Shelter clusters');
      }
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
          mapTestingCenters('testingCenters', geojsonForTesting);
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
          mapShelterData('alternativeShelters', geojsonForShelters, 'alternative-shelter');
        },
      });
    };

    mayMap.on('load', () => {
      loadDataPoints();
      mayMap.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
      mayMap.resize();
      ['Alternative Shelter clusters', 'Alternative Shelter cluster count', 'Unclustered Alternative Shelter', 'Testing Centers'].forEach((layer) => {
        mayMap.on('mouseenter', layer, () => {
          mayMap.getCanvas().style.cursor = 'pointer';
        });
        mayMap.on('mouseleave', layer, () => {
          mayMap.getCanvas().style.cursor = '';
        });
      });
      ['Unclustered Alternative Shelter', 'Testing Centers'].forEach((layer) => {
        mayMap.on('click', layer, (e) => {
          const title = e.features[0].properties.Name !== '' ? `<p class='tooltip__title'>${e.features[0].properties.Name}</p>` : `<p class='tooltip__title'>${e.features[0].properties.Address}</p>`;
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(title)
            .addTo(mayMap);
        });
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
            <image href={alternativeShelter} height="20" width="20" x="7" y="7" />
            <text x="32" y="22" className="map__legend-entry" fill="#1F4E46">Alternative shelter</text>
            <circle cx="17" cy="42" r="4" stroke="white" strokeWidth="1" fill="#03332D" />
            <text x="32" y="47" className="map__legend-entry" fill="#1F4E46">Testing center</text>
            <text x="8" y="75" className="map__legend-entry map__legend-entry--bold" fill="#1F4E46">Explore & Download</text>
            <text x="8" y="89" className="map__legend-entry map__legend-entry--bold" fill="#1F4E46">Data</text>
            <text x="8" y="105" className="map__legend-entry" fill="#03332D">
              &#8226;
              {' '}
              <a href="https://www.mass.gov/doc/ma-covid-19-testing-sites/download" className="calendar-viz__link" fill="#1F4E46">COVID-19 testing sites</a>
            </text>
            <text x="8" y="121" className="map__legend-entry" fill="#1F4E46">
              &#8226;
              {' '}
              <a href="https://docs.google.com/spreadsheets/d/1RYc2Y0wgjzt4liubLk_l631zUeAIz9ilCFHYNsthimU/edit?usp=sharing" className="calendar-viz__link" fill="#1F4E46">Alternative shelters</a>
            </text>
            <text x="8" y="137" className="map__legend-entry" fill="#1F4E46">
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
      <p>In the weeks since Governor Baker declared a state of emergency, municipalities across the region and commonwealth at large have been quickly assembling the necessary infrastructure to combat COVID-19. While most of MAPC’s work focuses on the Metropolitan Boston region, this is an all-hands-on-deck situation requiring extra cross-collaboration.</p>
      <p>As of April 24, there are 103 COVID-19 testing centers from across Massachusetts, spread over 72 municipalities. 64 of those centers are in 36 municipalities in our region, primarily in the Inner Core. When mobile testing at nursing homes, assisted living residences, and rest homes and facilities began as a pilot program on March 31, both the number of tests administered and percentage of tests returning positive increased. While this is due in part to viral spread, it also highlights the distinction between total cases and confirmed cases.</p>
      <p>With an increase in confirmed cases comes an increased need for isolated quarantine spaces above and beyond what many of us are practicing as daily physical distancing. Existing shelters have found themselves in a unique conundrum: while the necessity for safe shelter is more pertinent than ever, bed capacities often must be lowered to keep facilities compliant with physical distancing guidelines. Additionally, some who test positive may not be able to safely return to their homes for self-isolation due to overcrowding or proximity to immunocompromised housemates.</p>
      <p>In response, institutions such as hotels and universities across the commonwealth are partnering with municipalities and public health organizations to provide extra alternative shelters. Some are focusing on depopulating existing overcrowded shelters; others serve primarily to house first responders and front-line staff who cannot safely return to their primary residences. As Massachusetts enters the peak of infections, these sites will only become more necessary, and additional sites may be needed.</p>
      <p>
Below is a spreadsheet with all of the data currently on the above map. Because COVID-19’s impacts on our region and commonwealth are evolving every day, some testing centers or alternative shelters may be missing. If you know of such a facility that should be included, please reach out to Barry Keppard at
        {' '}
        <a href="mailto:bkeppard@mapc.org" className="calendar-viz__link">bkeppard@mapc.org</a>
.
      </p>
      <iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vT4cTPo1GJnF8Wll4OOP-Ow-DaCQ3vsbKSS4oF3KUK2k-vEIwZHRamXr8lLN4BOPcv2yD5pFF0FyYiA/pubhtml?widget=true&amp;headers=false" className="calendar-viz__spreadsheet" />
    </>
  );
};

export default May;
