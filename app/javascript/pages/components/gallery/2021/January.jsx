/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { MapContainer, TileLayer, ZoomControl, Popup } from 'react-leaflet';
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

const January = () => {
  const [selectedZone, setZone] = useState('');
  const [latLng, setLatLng] = useState('');
  return (
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
      <h1 className="calendar-viz__title">Introducing the MAPC Zoning Atlas</h1>
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
            url="https://geo.mapc.org/server/rest/services/gisdata/Zoning_Atlas_v01/MapServer/2"
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
                opacity: 1,
              };
            }}
            eventHandlers={{
              click: (e) => {
                setLatLng(e.latlng);
                setZone(e.layer.feature.properties);
              },
            }}
          />
          <TileLayer pane="overlayPane" url="https://api.mapbox.com/styles/v1/ihill/cki9ablq87wb01apa878hhbj8/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg" />
          <MapLegend
            columns={2}
            title="Effective Maximum Dwelling Units per Acre"
            legend={legend}
            dataLink=""
          >
            <span className="map-legend__title">Explore & Download Data</span>
            <ul className="map-legend__resource-list">
              <li className="map-legend__resource map-legend__entry">
                <a className="map-legend__link" href="https://mapc365.sharepoint.com/:x:/s/DataServicesSP/Efonrnmw_kdMhmG3Dw2BkTcBIpe2sC_2ADWTWfUjOs4JhQ?e=K65BCE">Tabular data (.csv)</a>
              </li>
              <li className="map-legend__resource map-legend__entry">
                <a className="map-legend__link" href="https://mapc365.sharepoint.com/sites/DataServicesSP/Shared%20Documents/Forms/AllItems.aspx?originalPath=aHR0cHM6Ly9tYXBjMzY1LnNoYXJlcG9pbnQuY29tLzpmOi9zL0RhdGFTZXJ2aWNlc1NQL0VyS2tYU0xIX2lCT2xEaEpyVFhsZHJZQklJWjRaWGU0Qmt3N095VmFwVnBYM1E%5FcnRpbWU9ekZlV3AzeW4yRWc&viewid=8aabc982%2D537d%2D48a6%2D89f7%2D8d8f0e9b716c&id=%2Fsites%2FDataServicesSP%2FShared%20Documents%2FZoning%20Database%2FShapefiles">Spatial data (.shp)</a>
              </li>
              <li className="map-legend__resource map-legend__entry">
                <a className="map-legend__link" href="https://zoningatlas.mapc.org">MAPC Zoning Atlas</a>
              </li>
            </ul>
          </MapLegend>
          {selectedZone ? (
            <Popup position={latLng}>
              <p className="tooltip__title">
                {selectedZone.zo_name}
                {' '}
                (
                {selectedZone.muni}
                )
              </p>
              <ul className="tooltip__list">
                <li className="tooltip__text">
                  {selectedZone.dupac_eff ? `${selectedZone.dupac_eff} effective maximum dwelling units per acre` : 'Effective maximum dwelling units per acre data not available'}
                </li>
              </ul>
            </Popup>
          ) : ''}
          <ZoomControl position="bottomright" />
        </MapContainer>
        <a href="http://mapbox.com/about/maps" className="mapboxgl__watermark" target="_blank" rel="noreferrer">Mapbox</a>
      </div>
      <p>MAPC&apos;s Zoning Atlas, nine years in the making, is the first zoning map for Greater Boston since 1999, and the first to include region-wide information about commercial density, overlay districts, multifamily housing, and more.</p>
      <p>
        Among much else, the map offers a standardized way to compare residential density across zones that allow that use by right: Dwelling units per acre are shown in this month’s map.
        <sup>1</sup>
      </p>
      <p>Why does the Atlas matter? Zoning is the DNA of a community&apos;s land use. It doesn&apos;t determine everything, but it&apos;s an underlying, coded blueprint for change, or sometimes the lack thereof. It affects a community&apos;s housing options, climate resilience, economy, public health, equity, transportation, emissions, and more.</p>
      <p>In this sense, zoning not only shapes a municipality&apos;s own future, but also that of its neighbors, and its neighbors&apos; neighbors. Our larger challenges demand an understanding of land use regulations on a regional basis.</p>
      <p>Yet Greater Boston’s zoning codes are complex, varied, hard to access, and bewildering, both as a whole and often on a municipality-by-municipality basis. The codes we were able to collect are a localized jumble of approaches, regulated metrics, exceptions and use-specific regulations, methods of calculation, and even definitions. One base zoning district had 58 footnotes detailing possible edge cases.</p>
      <p>To make sense of it all, the Atlas condenses the zoning codes of the region’s 101 municipalities into just under 80 fields. We identified a set of five “core fields” covering use allowances and dimensional requirements: minimum lot size, dwelling units allowed per acre, maximum building height, maximum floor area ratio (FAR), and whether multifamily housing was a permitted use (by right or with a special permit).</p>
      <p>
        Explore the Atlas and read more its creation and significance
        {' '}
        <a href="https://zoningatlas.mapc.org/" className="calendar-viz__link">here</a>
        . Even more important, help make the Atlas better. It is a dynamic online resource that will improve over time as municipal staff and other contributors refine the data and provide updates.
      </p>
      <p>
        The Zoning Atlas is part of
        {' '}
        <a href="https://metrocommon.mapc.org/" className="calendar-viz__link">MetroCommon 2050</a>
        , Greater Boston&apos;s next long-term plan, underway now.
      </p>
      <p>
        <em>
          <sup>1</sup>
          {' '}
          This metric is based directly on zoning code for approximately 20% of eligible zones and estimated for an additional 80%. A more thorough examination of our estimation methods and calculations can be found in the project’s
          {' '}
          <a href="https://metropolitan-area-planning-counc.gitbook.io/zoning-atlas-appendix/" className="calendar-viz__link">technical appendix</a>
          .
        </em>
      </p>
    </>
  );
};

export default January;
