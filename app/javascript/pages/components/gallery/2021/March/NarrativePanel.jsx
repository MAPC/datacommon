import React from 'react';
import { participation, scale } from './colors';

function setLegend(colors, entries) {
  return colors.map((color, i) => (
    <li key={entries[i].toString()}>
      <svg width="14" height="14">
        <circle cx="7" cy="7" r="7" fill={color} stroke="black" />
      </svg>
      <span className="map-narrative__legend-entry">{entries[i]}</span>
    </li>
  ));
}

const slides = {
  1: 'On March 10, 2020, Massachusetts entered a state of emergency as a response to the COVID-19 pandemic. Late last year, a survey was sent to zoning and planning boards across Massachusetts about how they have adapted. Professionals from 98 municipalities responded, highlighted here.',
  2: 'Almost all of them indicated that they continued to hold hearings during the pandemic, albeit virtually. This was brand-new for many muncipalities, and no one knew exactly how it might turn out.',
  3: 'At least in terms of public participation, though, it has been quite successful. About half of all respondents noticed that public participation went up with remote hearings.',
};

const legends = {
  3: setLegend(participation, ['More people participate', 'No difference', 'Fewer people participate']),
};

const NarrativePanel = ({ dispatch, data, slide }) => (
  <div className="map-narrative">
    <div>
      <p>{slides[slide]}</p>
      <ul>
        {legends[slide]}
      </ul>
    </div>
    <nav className="map-narrative__navigation">
      <button
        className="map-narrative__button"
        type="button"
        onClick={() => dispatch({ type: 'changeSlide', slide: slide - 1 })}
        disabled={!(slide > 1)}
      >
        &lt; Prev
      </button>
      <button
        className="map-narrative__button"
        type="button"
        onClick={() => dispatch({ type: 'changeSlide', slide: slide + 1 })}
        disabled={!(slide < 10)}
      >
        Next &gt;
      </button>
    </nav>
  </div>
);

export default NarrativePanel;
