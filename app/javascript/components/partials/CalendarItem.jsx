import React from 'react';

class CalendarItem extends React.Component {
  render() {
    return (
      <li className="calendar-grid__cell">
        <a href={this.props.link} className="calendar-item"> 
          <div className="calendar-item__month">{this.props.month}</div>
          <div className="calendar-item__box">
            <img src={this.props.image} className="calendar-item__image"/>
            <div className="calendar-item__title-box">
              <div className="calendar-item__title">{this.props.title}</div>
            </div>
          </div>
        </a>
      </li>
    );
  }
}
  
export default CalendarItem;
  