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
  2: 'Almost all of them indicated that they continued to hold hearings during the pandemic, albeit virtually. This was brand-new for many municipalities, and no one knew exactly how it might turn out.',
  3: 'At least in terms of public participation, though, it has been quite successful. About half of all respondents noticed that public participation went up with remote hearings.',
  4: 'One reason for the uptick in participation might be that attending is not an all-or-nothing decision. "Additional attendees that likely would not physically come to meetings have \'dropped by,\'" wrote one planner in western Massachusetts.',
  5: 'Some have noticed a decrease in public participation, though, potentially due to technological restrictions. If users do not have proper Internet access, sufficient hardware, or the necessary computer know-how, participating can be difficult.',
  6: '"We sometimes tell people if they have comments, it is best to send them electronically, before the meeting and we place on file," suggested another planner who noticed a decrease in public participation.',
  7: 'Many board members have embraced the virtual format, though some do still voice a preference for in-person meetings. Some tips and tricks have made for an easier transition.',
  8: 'Practicing the meeting beforehand can take some time, but it\'s well worth it: "Dry runs with members before first real meeting was extremely helpful and logging on to meetings 10-15 minutes early to troubleshoot any computer issues before meeting starts."',
  9: 'Several respondents mentioned the importance of keeping track of who all is in the room. "Ask anyone who calls in their name. Often times, we\'re stuck with Caller01 and Caller02 with no idea who they are," said one planner.',
  10: 'Another trend that has been met with success is having at least one co-host: "one to handle the technology required to share the screen so that plans and other materials can be viewed by all the participants." However, having multiple staff on each call may be cost-burdensome for small departments.',
  11: 'Have a backup plan, but also acknowledge that something might not go according to plan. "Be prepared to mess up. Something will go wrong. Bad link. Having to continue on the fly because folks can\'t log in," opined a planner who also gave the transition to virtual meetings high marks.',
  12: 'As vaccines roll out, we are entering a new stage of the COVID-19 era. Norms and practices will continue to evolve to meet the times, and we as planning professionals must continue to learn from one another to create safe, equitable hearings.',
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
        disabled={!(slide < 12)}
      >
        Next &gt;
      </button>
    </nav>
  </div>
);

export default NarrativePanel;
