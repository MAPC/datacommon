import React from 'react';
import PropTypes from 'prop-types';
import CalendarItem from './CalendarItem';
import BlankCalendarItem from './BlankCalendarItem';
import data from '../../assets/data/calendar-data.json';
import images from './images';

function populateGrid(selectedYear) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months.map((currentMonth) => {
    const monthData = data.find((item) => item.year === selectedYear && item.month === currentMonth);
    if (monthData) {
      return (
        <CalendarItem
          link={monthData.url}
          month={currentMonth}
          year={selectedYear}
          image={images[selectedYear][currentMonth]}
          title={monthData.title}
          key={`ci-${currentMonth}-${selectedYear}`}
        />
      );
    }
    return (
      null
    );
  });
}

const CalendarGrid = ({ selectedYear }) => (
  <ul className="CalendarGrid">
    {populateGrid(selectedYear)}
  </ul>
);

CalendarGrid.propTypes = {
  selectedYear: PropTypes.number.isRequired,
};

export default CalendarGrid;
