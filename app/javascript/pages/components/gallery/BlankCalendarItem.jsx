import React from 'react';
import PropTypes from 'prop-types';

const BlankCalendarItem = (props) => {
  const { month } = props;
  return (
    <li className="calendar-item__wrapper">
      <h2 className="calendar-item__month">{month}</h2>
      <div className="calendar-item__box--blank">
        <h3 className="calendar-item__title--blank">Coming Soon</h3>
      </div>
    </li>
  );
};

BlankCalendarItem.propTypes = {
  month: PropTypes.string.isRequired,
};

export default BlankCalendarItem;
