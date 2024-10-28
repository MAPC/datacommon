import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const CalendarItem = ({ link, month, year, image, title }) => {
  return (
    <li className="calendar-item__wrapper">
      <Link to={link}>
        <h2 className="calendar-item__month">
          {month} {year}
        </h2>
        <div className="calendar-item__box">
          <img src={image} className="calendar-item__image" alt={`Visualization for ${month}`} />
          <div className="calendar-item__title-box">
            <h3 className="calendar-item__title">{title}</h3>
          </div>
        </div>
      </Link>
    </li>
  );
};

CalendarItem.propTypes = {
  link: PropTypes.string.isRequired,
  month: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default CalendarItem;
