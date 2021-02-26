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
      <h1 className="calendar-viz__title">Municipal Reflections on the Pivot to Online Meetings</h1>
      <div className="calendar-viz">
        <Map data={state.data} slide={state.slide} />
        <NarrativePanel dispatch={dispatch} data={state.data} slide={state.slide} />
      </div>
      <p>
        Last Autumn (September 9 - October 14, 2020), six months into Massachusetts&apos;s COVID-19 state of emergency, a survey gauging ZBA (zoning board of approval) and planning board reactions to virtual meetings was sent to planners across the state. Now, with almost a full year of virtual hearings and meetings under our belts, we reflect on what we&apos;ve learned to make these meetings as effective and accessible as possible. The above map summarizes some of these findings.
      </p>
      <p><strong>Helpful links</strong></p>
      <ul className="calendar-viz__list">
        <li>
          <a
            href="https://mapc365.sharepoint.com/:b:/s/DataServicesSP/Eb1QlcdSwPRJvX4atU60UO4BEPW7mgczKNhSFUYXeaoKBg?e=XaoEIn"
            className="calendar-viz__link"
          >
            Report: <em>Findings on Virtual Hearings</em> by Ashley Clark, AICP
          </a>
        </li>
        <li>
          <a
            href="https://www.mapc.org/planning101/its-time-to-embrace-the-virtual-meeting-for-the-long-haul/"
            className="calendar-viz__link"
          >
            Blog: &quot;It&apos;s Time to Embrace the Virtual Meeting for the Long Haul&quot; by Carolina Prieto
          </a>
        </li>
        <li>
          <a
            href="https://www.mapc.org/resource-library/shared-practices-for-engagement-in-virtual-meetings/"
            className="calendar-viz__link"
          >
            Shared Practices for Engagement in Virtual Meetings
          </a>
        </li>
      </ul>
    </>
  );
};

export default March;
