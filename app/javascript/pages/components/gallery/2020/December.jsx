import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import mapboxgl from 'mapbox-gl';
import { VegaLite } from 'react-vega';
import chartData from '../../../../../assets/data/december2020-chart.json';

const colorPalette = ['#F3F3F3', '#B1C6D8', '#50789D', '#2e4b66', '#c1b9bb'];
const colorPolygon = (value) => {
  if (value >= 200) {
    return colorPalette[3];
  } if (value >= 100) {
    return colorPalette[2];
  } if (value >= 50) {
    return colorPalette[1];
  }
  return colorPalette[0];
};
const colorExpression = ['match', ['get', 'town']];

function toCamelCase(muniName) {
  return muniName.split(' ')
    .map((word) => word.charAt(0).concat(word.slice(1).toLowerCase()))
    .join(' ');
}

function setHeader(currentMuni, medianObj) {
  if (currentMuni && medianObj[currentMuni] !== '-') {
    return (
      <>
        <h3 className="calendar-viz__chart-title">{toCamelCase(currentMuni)}</h3>
        <h4 className="calendar-viz__chart-subtitle">
          Median download speed:
          {' '}
          {d3.format('.2f')(medianObj[currentMuni])}
          {' '}
          Mbps
        </h4>
      </>
    );
  }
  if (currentMuni) {
    return (
      <>
        <h3 className="calendar-viz__chart-title">{toCamelCase(currentMuni)}</h3>
        <h4 className="calendar-viz__chart-subtitle">Data unavailable</h4>
      </>
    );
  }
  return (
    <>
      <h3 className="calendar-viz__chart-title">Select a municipality</h3>
      <h4 className="calendar-viz__chart-subtitle">Median download speed</h4>
    </>
  );
}

const December = () => {
  const [mapData, setMapData] = useState();
  const [map, setMap] = useState();
  const [medianObj, setMedianObj] = useState({});
  const [currentMuni, setMuni] = useState('');
  const [spec, setSpec] = useState();
  // Get map data
  useEffect(() => {
    d3.csv('/assets/december2020.csv').then((response) => {
      setMapData(response);
    });
  }, []);
  // Declare map
  useEffect(() => {
    const decMap = new mapboxgl.Map({
      container: 'decMap',
      style: 'mapbox://styles/ihill/ckcnnn63u26o11ip2qf4odwyp',
      accessToken: 'pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg',
      center: [-70.944, 42.37],
      zoom: 8.4,
      minZoom: 6,
      maxZoom: 13,
      maxBounds: [
        [-74.728, 38.167], // Southwest bound
        [-66.541, 46.032], // Northeast bound
      ],
    });
    setMap(decMap);
  }, []);
  // Add map features and set median object
  useEffect(() => {
    if (mapData) {
      const tempMedianObj = {};
      mapData.forEach((row) => {
        colorExpression.push(row.muni, row.median_download_speed_mbps_2020 !== '-' ? colorPolygon(+row.median_download_speed_mbps_2020) : colorPalette[4]);
        tempMedianObj[row.muni] = row.median_download_speed_mbps_2020;
      });
      setMedianObj(tempMedianObj);
      colorExpression.push(colorPalette[4]);
      map.on('load', () => {
        map.addLayer({
          id: 'Median Download Speed',
          type: 'fill',
          source: 'composite',
          'source-layer': 'MA_Munis',
          paint: {
            'fill-color': colorExpression,
          },
        });
        map.moveLayer('Muni borders');
        map.moveLayer('MAPC outline');
        map.addLayer({
          id: 'Highlighted municipality',
          type: 'line',
          source: 'composite',
          'source-layer': 'MA_Munis',
          paint: {
            'line-color': '#FDB525',
            'line-width': 3,
            'line-opacity': 0,
          },
        });
        map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
      });
    }
  }, [mapData]);
  // Declare spec for histogram
  useEffect(() => {
    setSpec({
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: { name: currentMuni },
      mark: 'bar',
      width: 400,
      height: 'container',
      encoding: {
        x: {
          bin: { binned: true, step: 200 },
          field: 'bin0',
          title: 'Mbps (megabits per second) download speed',
        },
        x2: { field: 'bin1' },
        y: {
          field: 'frequency',
          type: 'quantitative',
          title: 'Number of tests (2020)',
        },
      },
    });
  }, [currentMuni]);

  if (map) {
    map.on('click', (e) => {
      const clickedData = map.queryRenderedFeatures([e.point.x, e.point.y], { layers: ['Median Download Speed'] });
      if (clickedData.length > 0) {
        setMuni(clickedData[0].properties.town);
        map.setPaintProperty('Highlighted municipality', 'line-opacity', ['match', ['get', 'town'], clickedData[0].properties.town, 1, 0]);
      } else {
        setMuni('');
        map.setPaintProperty('Highlighted municipality', 'line-opacity', 0);
      }
    });
  }
  return (
    <>
      <h1 className="calendar-viz__title">The Need for Speed</h1>
      <div className="calendar-viz__wrapper--two-col">
        <div className="calendar-viz__wrapper">
          <div id="decMap" className="mapboxgl__container" />
          <aside className="legend__wrapper legend__wrapper--datacommon">
            <div className="legend">
              <span className="legend__title legend__title--datacommon">Median Download Speed (Megabits per Second)</span>
              <svg height="160" width="168">
                <rect x="2" y="2" width="16" height="16" fill="#F3F3F3" stroke="#231F20" />
                <text x="28" y="14" className="legend__entry legend__entry--datacommon" fill="#231F20">1 – 50</text>
                <rect x="2" y="30" width="16" height="16" fill="#B1C6D8" stroke="#231F20" />
                <text x="28" y="42" className="legend__entry legend__entry--datacommon" fill="#231F20">50 – 100</text>
                <rect x="2" y="58" width="16" height="16" fill="#50789D" stroke="#231F20" />
                <text x="28" y="70" className="legend__entry legend__entry--datacommon" fill="#231F20">100 – 200</text>
                <rect x="2" y="86" width="16" height="16" fill="#2e4b66" stroke="#231F20" />
                <text x="28" y="98" className="legend__entry legend__entry--datacommon" fill="#231F20">200+</text>
                <rect x="2" y="114" width="16" height="16" fill="#c1b9bb" stroke="#231F20" />
                <text x="28" y="126" className="legend__entry legend__entry--datacommon" fill="#231F20">Data unavailable</text>
                <line x1="2" y1="148" x2="18" y2="148" style={{ stroke: '#231F20', strokeWidth: 3.5 }} />
                <text x="28" y="154" className="map__legend-entry" fill="#1F4E46">MAPC border</text>
              </svg>
              <a href="https://www.speedtest.net/" className="map__legend-entry map__legend-entry--bold map__legend-link" fill="#1F4E46">Test your Internet speed</a>
            </div>
          </aside>
        </div>
        <div className="calendar-viz__chart-wrapper">
          { spec ? (
            <>
              { setHeader(currentMuni, medianObj) }
              <VegaLite spec={spec} data={chartData[currentMuni]} />
            </>
          ) : ''}
        </div>
      </div>
      <p>Despite broadband currently not being treated as a public utility, it has been become an essential resource in 2020.  The COVID pandemic has created an environment where multiple members of the same household may need to be accessing video calls, online cloud storage, and other digital tools for work, school, and healthcare – potentially at the same time.  Having access to high speed and reliable internet is now no longer an amenity, it is a critical tool for daily life.</p>
      <p>The issue of internet access, broadly referred to as the &quot;Digital Divide&quot;, is a function of three critical access elements:</p>
      <ol className="calendar-viz__list calendar-viz__list--numbered">
        <li>An adequate device – A phone of tablet may be good for entertainment but nor for school or work.</li>
        <li>Literacy – The ability to use the device to access the tools and resources an individual needs.</li>
        <li>Connection – A household or building connection to an internet service provider at a price that they can afford.</li>
      </ol>
      <p>To better understand where there might be issues of quality connectivity or service provision, MAPC took M-Lab speed tests submitted by users and averaged the results of all speed tests made by a single user on a single day. Mapped are these median speeds by municipality for 2020. In the tooltip we show the distribution for each municipality. We put those averages into 5 megabit per second bins. The higher the bar in the histogram, the more people that have experienced speeds within the range for the bin (example 0-5Mbps). While there may be some clustering around speed tiers offered by internet service providers, there are a lot of factors that contribute to speed from equipment performance to heavy use with multiple family members sharing a connection.</p>
      <p>Across the Commonwealth, communities are looking to make investments in the infrastructure, equipment and training that can increase quality access to the internet.  MAPC believes that in collaboration with community stakeholders, municipal entities can play a leading role in ensuring internet access and connectivity for families, students, seniors, and other individuals who are needing to use digital resources in new ways.</p>
      <p>MAPC proposes a three-step approach to tackling municipal Digital Divide issues:</p>
      <ol className="calendar-viz__list calendar-viz__list--numbered">
        <li>Digital Community Needs Assessment – Identifying the barriers that individuals and households are facing across a community is an important first step to addressing Digital Divide issues. This evaluation should work to understand which critical element, or elements, are causing the barrier to access.</li>
        <li>Partnership and Program Development –Once the critical missing access elements have been identified in a community, assembling the right stakeholders to address the issues is the next step.Those stakeholders will depend on the missing element(s) and community context, but will likely involve entities that can provide community connections (community organizations, healthcare providers, housing authorities), digital services and equipment (libraries, nonprofits specializing in digital access, school districts) and ongoing access and maintenance (internet service providers, IT support providers, workforce training programs)</li>
        <li>Technology Evaluation and Procurement – Evaluating the existing and needed infrastructure to improve connectivity can be an important final step in improving digital access. Knowing where existing resources such as dark fiber lines, carrier hotels, and other components of internet infrastructure can provide direction for a municipality looking to improve connectivity for it’s residents and businesses.</li>
      </ol>
      <p>
        If your community is interested in exploring issues related to the digital divide, please reach out to MAPC Senior Economic Development Planner, Josh Eichen, at
        {' '}
        <a href="mailto:jeichen@mapc.org" className="calendar-viz__link">jeichen@mapc.org</a>
        {' '}
        and we would be happy to discuss potential technical assistance options.
      </p>
    </>
  );
};

export default December;
