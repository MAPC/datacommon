import React from 'react';
import { Routes, Route, Navigate, Link, useLocation, useParams } from 'react-router-dom';
import * as calendar2020 from './2020/index';
import * as calendar2021 from './2021/index';

const CalendarEntry = () => {

  const { year, month } = useParams();  
  // Direct component rendering based on URL params
  const renderCalendarContent = () => {
    if (year === '2021') {
      switch(month.toLowerCase()) {
        case 'january': return <calendar2021.January />;
        case 'february': return <calendar2021.February />;
        case 'march': return <calendar2021.March />;
        case 'april': return <calendar2021.April />;
        case 'may': return <calendar2021.May />;
        default: return null;
      }
    } else if (year === '2020') {
      switch(month.toLowerCase()) {
        case 'january': return <calendar2020.January />;
        case 'february': return <calendar2020.February />;
        case 'march': return <calendar2020.March />;
        case 'april': return <calendar2020.April />;
        case 'may': return <calendar2020.May />;
        case 'june': return <calendar2020.June />;
        case 'july': return <calendar2020.July />;
        case 'august': return <calendar2020.August />;
        case 'september': return <calendar2020.September />;
        case 'october': return <calendar2020.October />;
        case 'november': return <calendar2020.November />;
        case 'december': return <calendar2020.December />;
        default: return null;
      }
    }
    return null;
  };

  return (
    <section className="route Calendar">
      <div className="container">
        <Link to="/gallery" className="back-link">&lt;&lt; Back to Gallery</Link>
        {renderCalendarContent()}
      </div>
    </section>
  );
};

export default CalendarEntry;
