/* eslint-disable max-len */
import React, { useEffect } from 'react';
import Papa from 'papaparse';
import mapboxgl from 'mapbox-gl';
import alternativeShelter from '../../../assets/images/alternative-shelter.svg';
import CallToAction from '../../partials/CallToAction';

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

    const mapShelterData = (sourceName, geojson) => {
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
          'icon-image': 'alternative-shelter',
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
          'text-color': '#03332D',
        },
      });

      mayMap.addLayer({
        id: 'Unclustered Alternative Shelter',
        type: 'symbol',
        source: sourceName,
        filter: ['!', ['has', 'point_count']],
        layout: {
          'icon-image': 'alternative-shelter',
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
          'circle-color': '#FFFFFF',
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#03332D',
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
          mapShelterData('alternativeShelters', geojsonForShelters);
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
            <circle cx="17" cy="42" r="4" stroke="#03332D" strokeWidth="1" fill="white" />
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
      <p>In the weeks since the COVID-19 emergency began, municipalities across the Commonwealth have been ramping up testing capacity as quickly as possible. As of May 1, the number of COVID-19 testing centers in Massachusetts has increased to 103. Sixty-four of those centers are concentrated in 36 municipalities located primarily in our region’s Inner Core, where there are many residents who live in places in which social distancing and quarantine are not possible.</p>
      <p>With the expansion of testing, the number of confirmed cases grew – both because of the virus’s spread, and because of the increased rate of case identification. And with the concentration of testing in the Inner Core communities came a spike in confirmed cases among those with nowhere to quarantine themselves. Among these numbers are those who live in overcrowded places, those who live in close quarters with immunocompromised family members or housemates, and those who are homeless.</p>
      <p>Existing shelters have found themselves in a conundrum: while the necessity for safe shelter is greater than ever, bed capacities often must be lowered to keep facilities compliant with physical distancing guidelines.</p>
      <p>In response, institutions such as hotels and universities are partnering with municipalities and public health organizations to provide extra alternative shelters and isolation centers. Some are focusing on depopulating existing overcrowded shelters; others serve primarily to house first responders and front-line staff who cannot safely return to their primary residences. As Massachusetts enters the peak of infections, these sites will only become more necessary, and additional sites may be needed.</p>
      <p>
Below is a spreadsheet with all of the data currently on the above map. Because COVID-19’s impacts on our region and commonwealth are evolving every day, some testing facilities, alternative shelters, or isolation centers may be missing. If you know of such a facility that should be included, please reach out to Barry Keppard at
        {' '}
        <a href="mailto:bkeppard@mapc.org" className="calendar-viz__link">bkeppard@mapc.org</a>
.
      </p>
      <CallToAction
        link="https://www.mapc.org/resource-library/covid-19-resources/"
        text="View more MAPC COVID-19 resources"
        isDefaultLength={false}
        extraClassNames="calendar-viz__cta"
      />
      <iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vT4cTPo1GJnF8Wll4OOP-Ow-DaCQ3vsbKSS4oF3KUK2k-vEIwZHRamXr8lLN4BOPcv2yD5pFF0FyYiA/pubhtml?widget=true&amp;headers=false" className="calendar-viz__spreadsheet"/>
    </>
  );
};

export default May;
