import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import mapboxgl from 'mapbox-gl';
import { VegaLite } from 'react-vega';
import chartData from '../../../../../assets/data/december2020-chart.json';

const colorPalette = ['#F3F3F3', '#B1C6D8', '#50789D', '#2e4b66', '#c1b9bb'];
const colorPolygon = (value) => {
  if (value >= 200) {
    return colorPalette[3];
  }
  if (value >= 100) {
    return colorPalette[2];
  }
  if (value >= 50) {
    return colorPalette[1];
  }
  return colorPalette[0];
};
const colorExpression = ['match', ['get', 'town']];

function toCamelCase(muniName) {
  return muniName
    .split(' ')
    .map((word) => word.charAt(0).concat(word.slice(1).toLowerCase()))
    .join(' ');
}

function setHeader(currentMuni, medianObj) {
  if (currentMuni && medianObj[currentMuni] !== '-') {
    return (
      <>
        <h3 className="calendar-viz__chart-title">
          {toCamelCase(currentMuni)}
        </h3>
        <h4 className="calendar-viz__chart-subtitle">
          Median download speed: {d3.format('.2f')(medianObj[currentMuni])} Mbps
        </h4>
      </>
    );
  }
  if (currentMuni) {
    return (
      <>
        <h3 className="calendar-viz__chart-title">
          {toCamelCase(currentMuni)}
        </h3>
        <h4 className="calendar-viz__chart-subtitle">Data unavailable</h4>
      </>
    );
  }
  return (
    <h3 className="calendar-viz__chart-title">
      Click on a municipality to see the distribution of its speed test results
    </h3>
  );
}

const December = () => {
  const [mapData, setMapData] = useState();
  const [map, setMap] = useState();
  const [medianObj, setMedianObj] = useState({});
  const [currentMuni, setMuni] = useState('BOSTON');
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
      accessToken:
        'pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg',
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
        colorExpression.push(
          row.muni,
          row.median_download_speed_mbps_2020 !== '-'
            ? colorPolygon(+row.median_download_speed_mbps_2020)
            : colorPalette[4]
        );
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
            'line-opacity': ['match', ['get', 'town'], 'BOSTON', 1, 0],
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
      mark: { type: 'bar', binSpacing: 0 },
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
      const clickedData = map.queryRenderedFeatures([e.point.x, e.point.y], {
        layers: ['Median Download Speed'],
      });
      if (clickedData.length > 0) {
        setMuni(clickedData[0].properties.town);
        map.setPaintProperty('Highlighted municipality', 'line-opacity', [
          'match',
          ['get', 'town'],
          clickedData[0].properties.town,
          1,
          0,
        ]);
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
              <span className="legend__title legend__title--datacommon">
                Median Download Speed (Megabits per Second)
              </span>
              <svg height="200" width="168">
                <rect
                  x="2"
                  y="2"
                  width="16"
                  height="16"
                  fill="#F3F3F3"
                  stroke="#231F20"
                />
                <text
                  x="28"
                  y="14"
                  className="legend__entry legend__entry--datacommon"
                  fill="#231F20"
                >
                  1 – 50
                </text>
                <rect
                  x="2"
                  y="30"
                  width="16"
                  height="16"
                  fill="#B1C6D8"
                  stroke="#231F20"
                />
                <text
                  x="28"
                  y="42"
                  className="legend__entry legend__entry--datacommon"
                  fill="#231F20"
                >
                  50 – 100
                </text>
                <rect
                  x="2"
                  y="58"
                  width="16"
                  height="16"
                  fill="#50789D"
                  stroke="#231F20"
                />
                <text
                  x="28"
                  y="70"
                  className="legend__entry legend__entry--datacommon"
                  fill="#231F20"
                >
                  100 – 200
                </text>
                <rect
                  x="2"
                  y="86"
                  width="16"
                  height="16"
                  fill="#2e4b66"
                  stroke="#231F20"
                />
                <text
                  x="28"
                  y="98"
                  className="legend__entry legend__entry--datacommon"
                  fill="#231F20"
                >
                  200+
                </text>
                <rect
                  x="2"
                  y="114"
                  width="16"
                  height="16"
                  fill="#c1b9bb"
                  stroke="#231F20"
                />
                <text
                  x="28"
                  y="126"
                  className="legend__entry legend__entry--datacommon"
                  fill="#231F20"
                >
                  Data unavailable
                </text>
                <line
                  x1="2"
                  y1="148"
                  x2="18"
                  y2="148"
                  style={{ stroke: '#231F20', strokeWidth: 3.5 }}
                />
                <text
                  x="28"
                  y="154"
                  className="map__legend-entry"
                  fill="#1F4E46"
                >
                  MAPC border
                </text>
                <line
                  x1="2"
                  y1="176"
                  x2="18"
                  y2="176"
                  style={{ stroke: '#FDB525', strokeWidth: 3.5 }}
                />
                <text
                  x="28"
                  y="182"
                  className="map__legend-entry"
                  fill="#1F4E46"
                >
                  Selected
                </text>
                <text
                  x="28"
                  y="194"
                  className="map__legend-entry"
                  fill="#1F4E46"
                >
                  municipality
                </text>
              </svg>
              <a
                href="https://speed.measurementlab.net/"
                className="map__legend-entry map__legend-entry--bold map__legend-link"
                fill="#1F4E46"
              >
                Test your Internet speed
              </a>
              <a
                href="https://www.measurementlab.net/data/"
                className="map__legend-entry map__legend-link"
              >
                Explore and Download the Data
              </a>
            </div>
          </aside>
        </div>
        <div className="calendar-viz__chart-wrapper">
          {spec ? (
            <>
              {setHeader(currentMuni, medianObj)}
              <VegaLite spec={spec} data={chartData[currentMuni]} />
            </>
          ) : (
            ''
          )}
        </div>
      </div>
      <p>
        Fast, reliable internet is a basic need in the world of COVID. Not only
        does work, school, and healthcare often get done online, it often gets
        done online by multiple members of a household at once.
      </p>
      <p>
        To reveal where there might be speed deserts – gaps in adequate internet
        access – MAPC mapped the median download speed for each municipality in
        the Commonwealth. We also charted, by city or town, the distribution of
        internet connections that perform at various rates of download speeds.
      </p>
      <p>
        Most Massachusetts communities have an average download speed of 50–100
        megabits per second (mbps). But some average less than 30mbps – close to
        the threshold of what’s considered acceptable service by the federal
        government.
      </p>
      <p>
        Of course, many factors contribute to speed, from equipment performance
        to heavy use to multiple people sharing a connection. And download speed
        is not the only measure of internet access: That also requires an
        adequate device and digital literacy.
      </p>
      <p>
        For a household already working to bridge the{' '}
        <a
          href="https://www.mapc.org/resource-library/digital-divide/"
          className="calendar-viz__link"
        >
          Digital Divide
        </a>{' '}
        – already likely to have slower or fewer devices and to face barriers to
        internet fluency – low download speeds and poor connectivity can make
        things even harder.
      </p>
      <p>MAPC recommends municipalities tackle speed deserts in three steps:</p>
      <ol className="calendar-viz__list calendar-viz__list--numbered">
        <li>
          <strong>Perform a digital community-needs assessment</strong>
          {' – '}
          Specify and evaluate the municipality’s particular barriers to access.
        </li>
        <li>
          <strong>Assemble appropriate provider partners</strong>
          {' – '}
          Gather entities capable of providing the main elements of access:
          connections, digital services, equipment, and ongoing maintenance.
          Depending on the community this may include entities such as housing
          authorities, healthcare providers, schools, library, IT support
          providers, workforce training programs, and others.
        </li>
        <li>
          <strong>Technology and Procurement</strong>
          {' – '}
          Take inventory resources such as dark fiber lines, carrier hotels, and
          other components of internet infrastructure in order to determine
          needs.
        </li>
      </ol>
      <p>
        For assistance in exploring issues related to the digital divide,
        contact{' '}
        <a href="mailto:jeichen@mapc.org" className="calendar-viz__link">
          MAPC Senior Economic Development Planner, Josh Eichen
        </a>
        .
      </p>
      <p>
        The M-Lab NDT Data Set 2020-01-01–2020-11-23.{' '}
        <a href="https://www.measurementlab.net/tests/ndt/">
          https://www.measurementlab.net/tests/ndt/
        </a>
      </p>
    </>
  );
};

export default December;
