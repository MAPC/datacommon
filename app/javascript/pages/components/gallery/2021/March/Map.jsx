import React, { useState, useEffect } from 'react';
import ReactMapGL, { Source, Layer } from 'react-map-gl';
import { participation, scale } from './colors';


function respondentsChoropleth(data) {
  const choropleth = ['match', ['get', 'town']];
  data.forEach((row) => {
    choropleth.push(row.municipality, row.answers ? '#4DC1B9' : '#F0F8F3');
  });
  choropleth.push('#B6B6B6');
  return choropleth;
}

function impactChoropleth(data) {
  const colorFunc = (value) => {
    if (value === 'More people participate') {
      return participation[0];
    } if (value === 'No difference') {
      return participation[1];
    }
    return participation[2];
  };

  const choropleth = ['match', ['get', 'town']];
  data.forEach((row) => {
    choropleth.push(row.municipality, row.impact ? colorFunc(row.impact) : '#F0F8F3');
  });
  choropleth.push('#B6B6B6');
  return choropleth;
}

function boardRatingChoropleth(data) {
  const colorFunc = (value) => {
    if (value === 1) {
      return scale[0];
    } if (value === 2) {
      return scale[1];
    } if (value === 3) {
      return scale[2];
    } if (value === 4) {
      return scale[3];
    }
    return scale[4];
  };

  const choropleth = ['match', ['get', 'town']];
  data.forEach((row) => {
    choropleth.push(row.municipality, row['board sentiment'] ? colorFunc(row['board sentiment']) : '#F0F8F3');
  });
  choropleth.push('#B6B6B6');
  return choropleth;
}

const Map = ({ data, slide }) => {
  const [choropleth, setChoropleth] = useState('#00613F');
  const [viewport, setViewport] = useState({
    latitude: 42.10884,
    longitude: -71.42386,
    zoom: 7.62,
  });

  useEffect(() => {
    if (data.length > 0) {
      switch (slide) {
        case 1:
          setChoropleth(respondentsChoropleth(data));
          break;
        case 2:
          setChoropleth(respondentsChoropleth(data));
          break;
        case 3:
          setChoropleth(impactChoropleth(data));
          break;
        case 4:
          setChoropleth(boardRatingChoropleth(data));
          break;
        default:
          setChoropleth('#00613F');
          break;
      }
    }
  }, [data, slide]);
  return (
    <ReactMapGL
      {...viewport}
      height="700px"
      width="100%"
      onViewportChange={(viewport) => setViewport(viewport)}
      mapboxApiAccessToken="pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg"
      mapStyle="mapbox://styles/ihill/ckcnnn63u26o11ip2qf4odwyp"
      scrollZoom={false}
    >
      <Layer type="background" paint={{ 'background-color': '#F0F8F3' }} />
      <Source id="MA municipalities" type="vector" url="mapbox://ihill.1akk89mh">
        <Layer
          type="fill"
          source-layer="MA_Munis"
          paint={{ 'fill-color': choropleth, 'fill-outline-color': '#231F20' }}
        />
      </Source>
    </ReactMapGL>
  );
};

export default Map;
