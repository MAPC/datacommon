/* eslint-disable max-len */
import React from 'react';
import { participation, scale } from './colors';

function setLegend(colors, entries) {
  return colors.map((color, i) => (
    <li key={entries[i].toString()}>
      <svg width="15" height="15">
        <circle cx="7" cy="7" r="7" fill={color} stroke="black" />
      </svg>
      <span className="map-narrative__legend-entry">{entries[i]}</span>
    </li>
  ));
}

const slides = {
  1: (
    <p>
      Almost all of the 102 responding municipalities indicated that they continued to hold hearings during the pandemic, albeit virtually.
    </p>
  ),
  2: (
    <>
      <p>
        Remote hearings have seen increased public participation, according to about half of respondents. One reason might be that “attending” an online meeting is not an all-or-nothing decision. One planner in western Massachusetts wrote:
      </p>
      <blockquote className="map-narrative__quote">
        Additional attendees that likely would not physically come to meetings have &apos;dropped by.&apos;
      </blockquote>
      <p className="map-narrative__legend-title">Impact of virtual hearings on public participation</p>
    </>
  ),
  3: (
    <>
      <p>
        Not every municipality has seen this uptick. Some have noticed a decline in attendance, potentially due to limits on potential participants’ technological resources. For those who lack adequate Internet access, sufficient hardware, or the necessary computer know-how, participating can be difficult or impossible.
      </p>
      <p className="map-narrative__legend-title">Impact of virtual hearings on public participation</p>
    </>
  ),
  4: (
    <>
      <blockquote className="map-narrative__quote">
        We sometimes tell people if they have comments, it is best to send them electronically, before the meeting and we place on file
      </blockquote>
      <p>
        said another planner who noticed a decrease in public participation.
      </p>
      <p className="map-narrative__legend-title">Impact of virtual hearings on public participation</p>
    </>
  ),
  5: (
    <>
      <p>
        Several respondents mentioned discomfort with anonymous participants.
      </p>
      <blockquote className="map-narrative__quote">
        Oftentimes, we’re stuck with Caller01 and Caller02,
      </blockquote>
      <p>
        says one planner, who advises asking callers to identify themselves. Note, however, that under the Massachusetts Open Meeting Law, attendees may not be required to identify themselves, although they may be invited to do so.
      </p>
      <p className="map-narrative__legend-title">Impact of virtual hearings on public participation</p>
    </>
  ),
  6: (
    <>
      <p>
        Many municipalities have found it useful to have an extra person during meetings
      </p>
      <blockquote className="map-narrative__quote">
        […] to handle the technology required to share the screen so that plans and other materials can be viewed by all the participants.
      </blockquote>
      <p className="map-narrative__legend-title">On a scale of 1-5, how well would you say the technology works for the board?</p>
    </>
  ),
  7: (
    <>
      <p>
        As vaccines roll out, we are entering a new stage of the COVID-19 era. In the meantime, as with life,
      </p>
      <blockquote className="map-narrative__quote">
        [b]e prepared to mess up. Something will go wrong.
      </blockquote>
      <p className="map-narrative__legend-title">On a scale of 1-5, how well would you say the technology works for the board?</p>
    </>
  ),
  8: (
    <>
      <p>
        Be assured that norms and practices will continue to evolve to meet the times, and that we planning professionals will continue to learn from one another to create safe, equitable hearings. To contribute your thoughts, click <a href="https://mapc.az1.qualtrics.com/jfe/form/SV_6JexC8H5RTw6OmW" className="calendar-viz__link">here</a>.
      </p>
    </>
  )
};

const legends = {
  2: setLegend(participation, ['More people participate', 'No difference', 'Fewer people participate']),
  3: setLegend(participation, ['More people participate', 'No difference', 'Fewer people participate']),
  4: setLegend(participation, ['More people participate', 'No difference', 'Fewer people participate']),
  5: setLegend(participation, ['More people participate', 'No difference', 'Fewer people participate']),
  6: setLegend(scale, ['1 (the best)', '2', '3', '4', '5 (the worst)']),
  7: setLegend(scale, ['1 (the best)', '2', '3', '4', '5 (the worst)']),
};

const NarrativePanel = ({ dispatch, data, slide }) => (
  <div className="map-narrative">
    <div>
      {slides[slide]}
      <ul className="map-narrative__legend">
        {legends[slide]}
      </ul>
    </div>
    <nav className="map-narrative__navigation">
      <button
        className="map-narrative__button"
        tabIndex={0}
        type="button"
        onClick={() => dispatch({ type: 'changeSlide', slide: slide - 1 })}
        disabled={!(slide > 1)}
      >
        &lt; Prev
      </button>
      <button
        className="map-narrative__button"
        tabIndex={0}
        type="button"
        onClick={() => dispatch({ type: 'changeSlide', slide: slide + 1 })}
        disabled={!(slide < 8)}
      >
        Next &gt;
      </button>
    </nav>
  </div>
);

export default NarrativePanel;
