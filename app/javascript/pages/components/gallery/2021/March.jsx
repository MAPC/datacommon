/* eslint-disable max-len */
import React, { useEffect, useReducer } from 'react';
import ReactMapGL, { Source, Layer } from 'react-map-gl';
import * as d3 from 'd3';

const slides = {
  1: (
    <>
      <p>On March 10, 2020, Massachusetts entered a state of emergency as a response to the COVID-19 pandemic.</p>
      <p>Late last year, a survey was sent to zoning and planning boards across Massachusetts about how they have adapted. Professionals from 98 municipalities responded, highlighted here.</p>
    </>
  ),
  2: <p>Almost all of them indicated that they continued to hold hearings during the pandemic, albeit virtually. This was brand-new for many muncipalities, and no one knew exactly how it might turn out.</p>,
  3: <p>At least in terms of public participation, though, it has been quite successful. About half of all respondents noticed that public participation went up with remote hearings.</p>,
};

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
      return '#0097C4';
    } if (value === 'No difference') {
      return '#00613F';
    }
    return '#D59C29';
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
      return '#111436';
    } if (value === 2) {
      return '#233069';
    } if (value === 3) {
      return '#3B66B0';
    } if (value === 4) {
      return '#67CBE4';
    }
    return '#92C9ED';
  };

  const choropleth = ['match', ['get', 'town']];
  data.forEach((row) => {
    choropleth.push(row.municipality, row['board sentiment'] ? colorFunc(row['board sentiment']) : '#F0F8F3');
  });
  choropleth.push('#B6B6B6');
  return choropleth;
}

const March = () => {
  const initialState = {
    viewport: {
      latitude: 42.10884,
      longitude: -71.42386,
      zoom: 7.62,
    },
    data: [],
    choropleth: '#00613F',
    slide: 1,
  };

  function reducer(state, action) {
    switch (action.type) {
      case 'setViewport':
        return { ...state, viewport: action.viewport };
      case 'setData':
        return { ...state, data: action.data };
      case 'setChoropleth':
        return { ...state, choropleth: action.choropleth };
      case 'changeSlide':
        return { ...state, slide: action.slide };
      default:
        return { state };
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    d3.csv('/assets/ZBA-map-data.csv').then((data) => {
      dispatch({ type: 'setData', data });
    });
  }, []);

  useEffect(() => {
    if (state.data.length > 0) {
      switch (state.slide) {
        case 1:
          dispatch({ type: 'setChoropleth', choropleth: respondentsChoropleth(state.data) });
          break;
        case 2:
          dispatch({ type: 'setChoropleth', choropleth: respondentsChoropleth(state.data) });
          break;
        case 3:
          dispatch({ type: 'setChoropleth', choropleth: impactChoropleth(state.data) });
          break;
        case 4:
          dispatch({ type: 'setChoropleth', choropleth: boardRatingChoropleth(state.data) });
          break;
        default:
          dispatch({ type: 'setChoropleth', choropleth: '#00613F' });
          break;
      }
    }
  }, [state.data, state.slide]);

  return (
    <>
      <h1 className="calendar-viz__title">Lessons from Across Massachusetts</h1>
      <div className="calendar-viz">
        <ReactMapGL
          {...state.viewport}
          height="700px"
          width="100%"
          onViewportChange={(viewport) => dispatch({ type: 'setViewport', viewport })}
          mapboxApiAccessToken="pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg"
          mapStyle="mapbox://styles/ihill/ckcnnn63u26o11ip2qf4odwyp"
          scrollZoom={false}
        >
          <Layer type="background" paint={{ 'background-color': '#F0F8F3' }} />
          <Source id="MA municipalities" type="vector" url="mapbox://ihill.1akk89mh">
            <Layer
              type="fill"
              source-layer="MA_Munis"
              paint={{ 'fill-color': state.choropleth, 'fill-outline-color': '#231F20' }}
            />
          </Source>
        </ReactMapGL>
        <div className="map-narrative">
          {slides[state.slide]}
          <button
            className="map-narrative__button"
            type="button"
            onClick={() => dispatch({ type: 'changeSlide', slide: state.slide - 1 })}
            disabled={!(state.slide > 1)}
          >
            &lt; Prev
          </button>
          <button
            className="map-narrative__button"
            type="button"
            onClick={() => dispatch({ type: 'changeSlide', slide: state.slide + 1 })}
            disabled={!(state.slide < 10)}
          >
            Next &gt;
          </button>
        </div>
      </div>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Vivendum intellegat et qui, ei denique consequuntur vix. Offendit eleifend moderatius ex vix, quem odio mazim et qui, purto expetendis cotidieque quo cu, veri persius vituperata ei nec. Id doctus accommodare eam, pri an esse tota prodesset, te veniam oblique posidonium mel. Offendit eleifend moderatius ex vix, quem odio mazim et qui, purto expetendis cotidieque quo cu, veri persius vituperata ei nec. Vivendum intellegat et qui, ei denique consequuntur vix. Feugiat ceteros appellantur et sed, at illum virtute persequeris duo. Scripta periculis ei eam, te pro movet reformidans. Vivendum intellegat et qui, ei denique consequuntur vix. Scripta periculis ei eam, te pro movet reformidans. Pro ea animal dolores. Offendit eleifend moderatius ex vix, quem odio mazim et qui, purto expetendis cotidieque quo cu, veri persius vituperata ei nec. Pri viderer tamquam ei.
      </p>
    </>
  );
};

export default March;
