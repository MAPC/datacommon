import React from 'react';
import YearNavItem from './YearNavItem';

class YearNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedYear: this.props.selectedYear };
  }

  render() {
    const previousYears = ['20', '19', '18', '17', '16', '15'];
    const previousYearButtons = previousYears.map((year, i) => (
      <YearNavItem
        year={year}
        selected={false}
        changeYear={this.props.changeYear}
        key={i + 1}
      />
    ));
    return (
      <nav aria-labelledby="year-navigation__list" className="year-navigation">
        <ul className="container year-navigation__list year-navigation__desktop">
          <YearNavItem
            year="21"
            selected
            changeYear={this.props.changeYear}
            key={0}
          />
          {previousYearButtons}
        </ul>

        <select className="year-navigation__mobile" onChange={this.props.mobileChangeYear}>
        <option value={this.state.selectedYear}>2021</option>
          <option value="2020" >2020</option>
          <option value="2019">2019</option>
          <option value="2018">2018</option>
          <option value="2017">2017</option>
          <option value="2016">2016</option>
          <option value="2015">2015</option>
        </select>
      </nav>
    );
  }
}

export default YearNav;
