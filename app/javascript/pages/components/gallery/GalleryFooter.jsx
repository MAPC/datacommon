import React from 'react';
import CallToAction from '../partials/CallToAction';
import CalendarImg from '../../assets/images/calendar.png';

const GalleryFooter = () => (
  <div className="gallery-footer">
    <div className="gallery-footer__content">
      <a href="/files/final-mapc-calendar-2020.pdf">
        <div className="calendar-download">
          <img src={CalendarImg} alt="MAPC 2020 calendar" className="calendar-download__image" />
          <h3 className="calendar-download__text">Download 2020 Wall Calendar</h3>
        </div>
        <div className="calendar-download__calendar-shadow" />
      </a>
      <div className="gallery-footer__info">
        <h2 className="gallery-footer__title">2020 Calendar</h2>
        <p>MAPC has for many years produced a wall calendar that provides recipients with insightful information about the region, in the form of a monthly map or data visualization. Each year, these monthly segments covered a wide variety of topics.</p>
        <p>This year, we are moving to a new format, with two components: the print calendar, which is available for download, and digital visualizations published each month here on MAPC’s MetroBoston DataCommon. Join the MAPC newsletter to get the monthly visualizations delivered to your inbox.</p>
        <CallToAction
          link="https://lp.constantcontact.com/su/Vab7XBS"
          text="Sign Up"
        />
      </div>
    </div>
  </div>
);


export default GalleryFooter;
