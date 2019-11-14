import React from 'react';

class YearNavItem extends React.Component {
  render() {
    const fullYear = "20" + this.props.year;
    let selectedClassName;
    if (this.props.selected) {
      selectedClassName = "year-navigation__year year-navigation__year--selected"
    } else {
      selectedClassName = "year-navigation__year"
    }
    return (
      <li className="year-navigation__item">
        <span className={selectedClassName} onClick={() => this.props.changeYear({fullYear})} id={fullYear}>
          <span className="year-navigation__year--lightgreen">20</span>
          <span className="year-navigation__year--darkgreen">{this.props.year}</span>
          <div className="year-navigation__arrow" />
        </span>
      </li>    
    );
  }
}

export default YearNavItem;
