import React, { useReducer, useEffect } from 'react';
import ReactMapGL, { Source, Layer } from 'react-map-gl';
import * as d3 from 'd3';

const choroplethColors = ['#f2f0f7', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#4a1486'];
const views = {
  mhi: {
    id: 1,
    title: 'Median Household Income',
    choroplethFunc: (value) => {
      if (value <= 35000) {
        return choroplethColors[6];
      } if (value <= 50000) {
        return choroplethColors[5];
      } if (value <= 75000) {
        return choroplethColors[4];
      } if (value <= 100000) {
        return choroplethColors[3];
      } if (value <= 150000) {
        return choroplethColors[2];
      } if (value <= 200000) {
        return choroplethColors[1];
      }
      return choroplethColors[0];
    },
  },
  ch_rhu_p: {
    id: 2,
    title: 'Change in % Rented Housing Units',
    choroplethFunc: (value) => {
      if (value <= -100) {
        return choroplethColors[6];
      } if (value <= -25) {
        return choroplethColors[5];
      } if (value <= 25) {
        return choroplethColors[4];
      } if (value <= 50) {
        return choroplethColors[3];
      } if (value <= 100) {
        return choroplethColors[2];
      } if (value <= 200) {
        return choroplethColors[1];
      }
      return choroplethColors[0];
    },
  },
};

const FebruaryMap = () => {
  const initialState = {
    viewport: {
      latitude: 42.3653,
      longitude: -71.0834,
      zoom: 8.4,
    },
    data: [],
    chartView: 'mhi',
    choropleth: 'white',
  };

  function reducer(state, action) {
    switch (action.type) {
      case 'setData':
        return { ...state, data: action.data };
      case 'setViewport':
        return { ...state, viewport: action.viewport };
      case 'setMapChoropleth':
        return { ...state, choropleth: action.choropleth };
      default:
        return { state };
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    d3.csv('/assets/february2021.csv').then((result) => {
      dispatch({ type: 'setData', data: result });
    });
  }, []);

  useEffect(() => {
    const tempChoropleth = ['match', ['get', 'ct10_id']];
    state.data.forEach((row) => {
      tempChoropleth.push(row.ct10_id, row[state.chartView] ? views[state.chartView].choroplethFunc(+row[state.chartView]) : 'rgba(0, 0, 0, 0)');
    });
    tempChoropleth.push('rgb(255, 255, 255)');
    dispatch({ type: 'setMapChoropleth', choropleth: tempChoropleth });
  }, [state.chartView, state.data]);

  return (
    <ReactMapGL
      {...state.viewport}
      width="700px"
      height="500px"
      onViewportChange={(viewport) => dispatch({ type: 'setViewport', viewport })}
      mapboxApiAccessToken="pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg"
      mapStyle="mapbox://styles/ihill/ckjn5vkva2jbv19oxvi39hc66"
    >
      <Source id="2010 Census Tracts" type="vector" url="mapbox://ihill.aw7gvvhk">
        <Layer
          type="fill"
          id="Tract choropleth"
          source="2010 Census Tracts"
          source-layer="Tracts-2jsl06"
          paint={{ 'fill-color': state.choropleth, 'fill-outline-color': '#231F20' }}
        />
      </Source>
      <Source id="MAPC borders" type="vector" url="mapbox://ihill.763lks2o">
        <Layer
          type="line"
          id="MAPC municipal borders"
          source="MAPC borders"
          source-layer="MAPC_borders-0im3ea"
        />
      </Source>
    </ReactMapGL>
  );
};

export default FebruaryMap;
