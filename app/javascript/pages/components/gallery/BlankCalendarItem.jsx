import React from 'react';
import PropTypes from 'prop-types';

const BlankCalendarItem = (props) => {
  const { month } = props;
  return (
    <li className="calendar-item__wrapper--blank">
      <h2 className="calendar-item__month">{month}</h2>
      <h3 className="blank-calendar-item__title">Coming Soon</h3>
    </li>
  );
};

BlankCalendarItem.propTypes = {
  month: PropTypes.string.isRequired,
};

export default BlankCalendarItem;
