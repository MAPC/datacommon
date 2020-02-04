/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import CalendarItem from './CalendarItem';
import BlankCalendarItem from './BlankCalendarItem';
import data from '../../assets/data/temp-cal-data.json';


class CalendarGrid extends React.Component {
  render() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const existingCalendarItems = data.filter((item) => item.year === this.props.selectedYear)
      .map((item, i) => {
        months.shift();
        return <CalendarItem
          link={item.url}
          month={item.month}
          year={item.year}
          image={item.image}
          item={item}
          title={item.title}
          key={i}
        />
      });

    // Create some number of blank cards
    const blankCalendarItems = months.map((month, i) => {
      const blankDisplayMonth = `${month} ${this.props.selectedYear}`;
      const keyValue = `b${i}`;
      return (
        <BlankCalendarItem
          month={blankDisplayMonth}
          key={keyValue}
        />
      );
    });

    const allCalendarItems = existingCalendarItems.concat(blankCalendarItems);
    return (
      <ul className="CalendarGrid">
        {allCalendarItems}
      </ul>
    );
  }
}

export default CalendarGrid;