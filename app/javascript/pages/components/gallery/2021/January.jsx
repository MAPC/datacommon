/* eslint-disable object-curly-newline */
import React from 'react';
import { Helmet } from 'react-helmet';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { FeatureLayer } from 'react-esri-leaflet';
import MapLegend from '../../visualizations/MapLegend';

const dataNa = '#d8d8d8';
const legend = [
  { color: '#f6c61e', value: '1–4', min: 1, max: 5 },
  { color: '#f4a617', value: '5–9', min: 5, max: 10 },
  { color: '#F8970D', value: '10–14', min: 10, max: 15 },
  { color: '#e96b14', value: '15–19', min: 15, max: 20 },
  { color: '#fc3a1c', value: '20–24', min: 20, max: 25 },
  { color: '#eb003f', value: '25–49', min: 25, max: 50 },
  { color: '#dd0058', value: '50–74', min: 50, max: 75 },
  { color: '#f40080', value: '75–99', min: 75, max: 100 },
  { color: '#b700a6', value: '100–199', min: 100, max: 200 },
  { color: '#6800b6', value: '200–299', min: 200, max: 300 },
  { color: '#0000E3', value: '300–399', min: 300, max: 400 },
  { color: dataNa, value: 'Data n/a' },
];

const January = () => (
  <>
    <Helmet>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossOrigin=""
      />
      <script
        src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
        integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
        crossOrigin=""
      />
      <link
        rel="stylesheet"
        href="https://unpkg.com/esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css"
      />
    </Helmet>
    <h1 className="calendar-viz__title">Zoning</h1>
    <div className="calendar-viz__wrapper">
      <MapContainer
        center={[42.37, -70.944]}
        zoom={9}
        maxZoom={14}
        minZoom={9}
        zoomControl={false}
      >
        <TileLayer
          url="https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}/?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA#1.07/0/0"
          attribution='© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'
          tileSize={512}
          zoomOffset={-1}
        />
        <FeatureLayer
          url="https://geo.mapc.org/server/rest/services/gisdata/Zoning_Atlas_v01/MapServer/1"
          pane="tilePane"
          simplifyFactor={0.25}
          style={(feature) => {
            const color = legend.find((option) => feature.properties.dupac_eff >= option.min && feature.properties.dupac_eff < option.max)
              ? legend.find((option) => feature.properties.dupac_eff >= option.min && feature.properties.dupac_eff < option.max).color
              : dataNa;
            return {
              color,
              weight: 0.5,
              fillOpacity: 0.8,
              opacity: 0.75,
            };
          }}
        />
        <TileLayer pane="overlayPane" url="https://api.mapbox.com/styles/v1/ihill/cki9ablq87wb01apa878hhbj8/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg" />
        <MapLegend
          columns={2}
          title="Effective Dwelling Units per Acre"
          legend={legend}
          dataLink=""
        >
          <span className="map-legend__title">Explore & Download Data</span>
          <ul className="map-legend__resource-list">
            <li className="map-legend__resource map-legend__entry">
              <a className="map-legend__link" href="https://datacommon.mapc.org/browser/datasets/421">DataCommon dataset</a>
            </li>
            <li className="map-legend__resource map-legend__entry">
              <a className="map-legend__link" href="https://zoningatlas.mapc.org/data">MAPC Zoning Atlas</a>
            </li>
          </ul>
        </MapLegend>
        <ZoomControl position="bottomright" />
      </MapContainer>
      <a href="http://mapbox.com/about/maps" className="mapboxgl__watermark" target="_blank">Mapbox</a>
    </div>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <p>Vivendum intellegat et qui, ei denique consequuntur vix. Pri posse graeco definitiones cu, id eam populo quaestio adipiscing, usu quod malorum te. Vivendum intellegat et qui, ei denique consequuntur vix. Scripta periculis ei eam, te pro movet reformidans. Pri posse graeco definitiones cu, id eam populo quaestio adipiscing, usu quod malorum te.</p>
    <p>Offendit eleifend moderatius ex vix, quem odio mazim et qui, purto expetendis cotidieque quo cu, veri persius vituperata ei nec. Sonet cotidieque ei vel. No dicam aperiam vis. Scripta periculis ei eam, te pro movet reformidans. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Vivendum intellegat et qui, ei denique consequuntur vix. Erroribus adipiscing id eam. Vivendum intellegat et qui, ei denique consequuntur vix. Qui gloriatur scribentur et, id velit verear mel, cum no porro debet.</p>
  </>
);

export default January;
