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
      On
      {' '}
      <strong>March 10, 2020,</strong>
      {' '}
      Massachusetts entered a state of emergency as a response to the COVID-19 pandemic.
      {' '}
      <strong>Last September</strong>
      , a survey was sent to zoning and planning boards across Massachusetts about how they have adapted. Professionals from 98 municipalities responded, highlighted here.
    </p>),
  2: (
    <p>
      Almost all of them indicated that they continued to hold hearings during the pandemic, albeit virtually. This was brand-new for many municipalities, and no one knew exactly how it might turn out.
    </p>
  ),
  3: (
    <>
      <p>
        At least in terms of public participation, though, it has been quite successful. About half of all respondents noticed that public participation went up with remote hearings.
      </p>
      <p className="map-narrative__legend-title">Impact of virtual hearings on public participation</p>
    </>
  ),
  4: (
    <>
      <p>
        One reason for the uptick in participation might be that attending is not an all-or-nothing decision. One planner in western Massachusetts wrote:
      </p>
      <blockquote className="map-narrative__quote">
        Additional attendees that likely would not physically come to meetings have &apos;dropped by.&apos;
      </blockquote>
      <p className="map-narrative__legend-title">Impact of virtual hearings on public participation</p>
    </>
  ),
  5: (
    <>
      <p>
        Some have noticed a decrease in public participation, though, potentially due to technological restrictions. If users do not have proper Internet access, sufficient hardware, or the necessary computer know-how, participating can be difficult.
      </p>
      <p className="map-narrative__legend-title">Impact of virtual hearings on public participation</p>
    </>
  ),
  6: (
    <>
      <blockquote className="map-narrative__quote">
        We sometimes tell people if they have comments, it is best to send them electronically, before the meeting and we place on file
      </blockquote>
      <p>suggested another planner who noticed a decrease in public participation.</p>
      <p className="map-narrative__legend-title">Impact of virtual hearings on public participation</p>
    </>

  ),
  7: (
    <>
      <p>
        Many board members have embraced the virtual format, though some do still voice a preference for in-person meetings. Some tips and tricks have made for an easier transition.
      </p>
      <p className="map-narrative__legend-title">On a scale of 1-5, how well would you say the technology works for the board?</p>
    </>
  ),
  8: (
    <>
      <p>
        Practicing the meeting beforehand can take some time, but it&apos;s well worth it.
      </p>
      <blockquote className="map-narrative__quote">
        Dry runs with members before first real meeting was extremely helpful and logging on to meetings 10-15 minutes early to troubleshoot any computer issues before meeting starts.
      </blockquote>
      <p className="map-narrative__legend-title">On a scale of 1-5, how well would you say the technology works for the board?</p>
    </>
  ),
  9: (
    <>
      <p>
        Several respondents mentioned the importance of keeping track of who all is in the room. Said one planner:
      </p>
      <blockquote className="map-narrative__quote">
        Ask anyone who calls in their name. Often times, we&apos;re stuck with Caller01 and Caller02 with no idea who they are.
      </blockquote>
      <p className="map-narrative__legend-title">On a scale of 1-5, how well would you say the technology works for the board?</p>
    </>
  ),
  10: (
    <>
      <p>
        Another trend that has been met with success is having at least one co-host:
      </p>
      <blockquote className="map-narrative__quote">
        ...one to handle the technology required to share the screen so that plans and other materials can be viewed by all the participants.
      </blockquote>
      <p>
        However, having multiple staff on each call may be cost-burdensome for small departments.
      </p>
      <p className="map-narrative__legend-title">On a scale of 1-5, how well would you say the technology works for the board?</p>
    </>
  ),
  11: (
    <>
      <p>
        Have a backup plan, but also acknowledge that something might not go according to plan.
      </p>
      <blockquote className="map-narrative__quote">
        Be prepared to mess up. Something will go wrong. Bad link. Having to continue on the fly because folks can&apos;t log in.
      </blockquote>
      <p>
        opined a planner who also gave the transition to virtual meetings high marks.
      </p>
      <p className="map-narrative__legend-title">On a scale of 1-5, how well would you say the technology works for the board?</p>
    </>
  ),
  12: (
    <p>
      As vaccines roll out, we are entering a new stage of the COVID-19 era. Norms and practices will continue to evolve to meet the times, and we as planning professionals must continue to learn from one another to create safe, equitable hearings.
    </p>
  ),
};

const legends = {
  3: setLegend(participation, ['More people participate', 'No difference', 'Fewer people participate']),
  4: setLegend(participation, ['More people participate', 'No difference', 'Fewer people participate']),
  5: setLegend(participation, ['More people participate', 'No difference', 'Fewer people participate']),
  6: setLegend(participation, ['More people participate', 'No difference', 'Fewer people participate']),
  7: setLegend(scale, ['1 (the best)', '2', '3', '4', '5 (the worst)']),
  8: setLegend(scale, ['1 (the best)', '2', '3', '4', '5 (the worst)']),
  9: setLegend(scale, ['1 (the best)', '2', '3', '4', '5 (the worst)']),
  10: setLegend(scale, ['1 (the best)', '2', '3', '4', '5 (the worst)']),
  11: setLegend(scale, ['1 (the best)', '2', '3', '4', '5 (the worst)']),
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
        disabled={!(slide < 12)}
      >
        Next &gt;
      </button>
    </nav>
  </div>
);

export default NarrativePanel;
