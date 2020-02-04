import React from 'react';
import YearNav from './YearNav';
import CalendarGrid from './CalendarGrid';
import CalendarDownload from './CalendarDownload';

class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedYear: 2020 };
    this.changeYear = this.changeYear.bind(this);
    this.mobileChangeYear = this.mobileChangeYear.bind(this);
  }

  changeYear(clickedYear) {
    this.setState((prevState) => {
      const newSelectedYear = document.getElementById(clickedYear.fullYear);
      const oldSelectedYear = document.getElementById(prevState.selectedYear);

      if (newSelectedYear === oldSelectedYear) {
        return;
      }

      newSelectedYear.className = 'year-navigation__year year-navigation__year--selected';
      oldSelectedYear.className = 'year-navigation__year';
      return { selectedYear: parseInt(clickedYear.fullYear, 10) };
    });
  }

  mobileChangeYear() {
    this.setState({ selectedYear: parseInt(event.target.value, 10) });
  }

  render() { 
    return (
      <div className="route Gallery">
        <YearNav
          selectedYear={this.state.selectedYear}
          changeYear={this.changeYear}
          mobileChangeYear={this.mobileChangeYear}
        />
        <CalendarGrid
          selectedYear={this.state.selectedYear}
        />
        <CalendarDownload />
      </div>
    );
  }
}

export default Gallery;
