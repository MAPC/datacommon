import React from 'react';
import { Switch, Route } from 'react-router-dom';
import January from './calendar-visualizations/2020/January';
import February from './calendar-visualizations/2020/February';

const Calendar = (props) => (
  <section className="route Calendar">
    <div className="container">
      <a href="/gallery" className="back-link">&lt;&lt; Back to 2020 Gallery</a>
      <Switch>
        <Route path="/calendar/2020/january" component={January} />
        <Route path="/calendar/2020/february" component={February} />
      </Switch>
    </div>
  </section>
);

export default Calendar;
