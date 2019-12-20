import React from 'react';

class BlankCalendarItem extends React.Component {
  render() {
    return (
      <li className="calendar-grid__cell">
        <a href={this.props.link} className="calendar-item"> 
          <h2 className="calendar-item__month">{this.props.month}</h2>
          <div className="calendar-item__box--blank">
            <h3 className="calendar-item__title--blank">Coming Soon</h3>
          </div>
        </a>
      </li>
    );
  }
}
  
export default BlankCalendarItem;
  