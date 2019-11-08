import React from 'react';
import CalendarItem from './CalendarItem'
import data from '../../../assets/data/temp-cal-data.json'

class CalendarGrid extends React.Component {
  render() {
    const calendarItemsForYear = data.filter(item => item.year === this.props.selectedYear)
    .map((item, i) => {
      return <CalendarItem
        link={item.url}
        month={item.month}
        image={item.image}
        title={item.title}
        key={i}
      />
    })

    return (
      <ul className="component CalendarGrid container">
        {calendarItemsForYear}
      </ul>
    );
  }

}

export default CalendarGrid;
