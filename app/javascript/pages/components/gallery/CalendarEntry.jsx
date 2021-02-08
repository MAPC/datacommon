import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import * as calendar2020 from './2020/index';
import * as calendar2021 from './2021/index';

const CalendarEntry = () => (
  <section className="route Calendar">
    <div className="container">
      <a href="/gallery" className="back-link">&lt;&lt; Back to Gallery</a>
      <Switch>
        <Route path="/calendar/2020/january" component={calendar2020.January} />
        <Route path="/calendar/2020/february" component={calendar2020.February} />
        <Route path="/calendar/2020/march" component={calendar2020.March} />
        <Route path="/calendar/2020/april" component={calendar2020.April} />
        <Route path="/calendar/2020/may" component={calendar2020.May} />
        <Route path="/calendar/2020/june" component={calendar2020.June} />
        <Route path="/calendar/2020/july" component={calendar2020.July} />
        <Route path="/calendar/2020/august" component={calendar2020.August} />
        <Route path="/calendar/2020/september" component={calendar2020.September} />
        <Route path="/calendar/2020/october" component={calendar2020.October} />
        <Route path="/calendar/2020/november" component={calendar2020.November} />
        <Route path="/calendar/2020/december" component={calendar2020.December} />
        <Route path="/gallery/2021/january" component={calendar2021.January} />
        <Route path="/calendar/2021/january">
          <Redirect to="/gallery/2021/january" />
        </Route>
        <Route path="/gallery/2021/february" component={calendar2021.February} />
        <Route path="/calendar/2021/february">
          <Redirect to="/gallery/2021/february" />
        </Route>
        <Route path="/gallery/2021/march" component={calendar2021.March} />
      </Switch>
    </div>
  </section>
);

export default CalendarEntry;
