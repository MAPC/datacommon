import React from 'react';
import CallToAction from '../partials/CallToAction';
import CalendarImg from '../../assets/images/calendar.png';

const CalendarDownload = () => (
  <section className="calendar-download">
    <div className="calendar-download--wrapper">
      <h2>2020 Calendar</h2>
      <div className="calendar-download__content">
        <a href="/files/final-mapc-calendar-2020.pdf" className="calendar-download__image--wrapper">
          <img src={CalendarImg} alt="MAPC 2020 calendar" className="calendar-download__image" />
        </a>
        <div className="calendar-download__info">
          <p>MAPC has for many years produced a wall calendar that provides recipients with insightful information about the region, in the form of a monthly map or data visualization. Each year, these monthly segments covered a wide variety of topics.</p>
          <p>This year, we are moving to a new format, with two components: the print calendar and digital maps and data visualizations we will publish each month here on MAPC’s MetroBoston DataCommon. We hope you will both hang this poster on your wall, and visit datacommon.mapc.org to see a new map or data visualization on the first of each month.</p>
          <CallToAction
            link="https://lp.constantcontact.com/su/Vab7XBS"
            text="Sign Up"
          />
        </div>
      </div>
    </div>
  </section>
);


export default CalendarDownload;
