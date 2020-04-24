import React from 'react';
import { Switch, Route } from 'react-router-dom';
import * as calendar2020 from './2020/index';

const CalendarEntry = () => (
  <section className="route Calendar">
    <div className="container">
      <a href="/gallery" className="back-link">&lt;&lt; Back to 2020 Gallery</a>
      <Switch>
        <Route path="/calendar/2020/january" component={calendar2020.January} />
        <Route path="/calendar/2020/february" component={calendar2020.February} />
        <Route path="/calendar/2020/march" component={calendar2020.March} />
        <Route path="/calendar/2020/april" component={calendar2020.April} />
        <Route path="/calendar/2020/may" component={calendar2020.May} />
      </Switch>
    </div>
  </section>
);

export default CalendarEntry;
