import React from 'react';
import YearNav from './partials/YearNav';
import CalendarGrid from './partials/CalendarGrid';


class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {selectedYear: 2020};
    this.changeYear = this.changeYear.bind(this);
    this.mobileChangeYear = this.mobileChangeYear.bind(this);
  }

  changeYear(clickedYear) {
    this.setState((prevState) => {
      event.stopPropagation();
      const newSelectedYear = document.getElementById(clickedYear.fullYear)
      const oldSelectedYear = document.getElementById(prevState.selectedYear)

      if (newSelectedYear === oldSelectedYear) {
        return
      }

      newSelectedYear.className = 'year-navigation__year year-navigation__year--selected'
      oldSelectedYear.className = 'year-navigation__year'
      return {selectedYear: parseInt(clickedYear.fullYear)}
    })
  }

  mobileChangeYear() {
    this.setState({selectedYear: parseInt(event.target.value)})
  }

  render() {
    return (
      <section className="route Gallery">
        <YearNav
          selectedYear={this.state.selectedYear} 
          changeYear={this.changeYear}
          mobileChangeYear={this.mobileChangeYear}
        />
        <CalendarGrid 
          selectedYear={this.state.selectedYear}
        />
      </section>
    );
  }

}

export default Gallery;

