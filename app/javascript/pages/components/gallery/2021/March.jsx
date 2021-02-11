/* eslint-disable max-len */
import React, { useEffect, useReducer } from 'react';
import * as d3 from 'd3';
import NarrativePanel from './March/NarrativePanel';
import Map from './March/Map';

const March = () => {
  const initialState = {
    data: [],
    slide: 1,
  };

  function reducer(state, action) {
    switch (action.type) {
      case 'setData':
        return { ...state, data: action.data };
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

  return (
    <>
      <h1 className="calendar-viz__title">Lessons from Across Massachusetts</h1>
      <div className="calendar-viz">
        <Map data={state.data} slide={state.slide} />
        <NarrativePanel dispatch={dispatch} data={state.data} slide={state.slide} />
      </div>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Vivendum intellegat et qui, ei denique consequuntur vix. Offendit eleifend moderatius ex vix, quem odio mazim et qui, purto expetendis cotidieque quo cu, veri persius vituperata ei nec. Id doctus accommodare eam, pri an esse tota prodesset, te veniam oblique posidonium mel. Offendit eleifend moderatius ex vix, quem odio mazim et qui, purto expetendis cotidieque quo cu, veri persius vituperata ei nec. Vivendum intellegat et qui, ei denique consequuntur vix. Feugiat ceteros appellantur et sed, at illum virtute persequeris duo. Scripta periculis ei eam, te pro movet reformidans. Vivendum intellegat et qui, ei denique consequuntur vix. Scripta periculis ei eam, te pro movet reformidans. Pro ea animal dolores. Offendit eleifend moderatius ex vix, quem odio mazim et qui, purto expetendis cotidieque quo cu, veri persius vituperata ei nec. Pri viderer tamquam ei.
      </p>
    </>
  );
};

export default March;
