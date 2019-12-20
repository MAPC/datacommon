import React from 'react';
import YearNav from './partials/YearNav';
import CalendarGrid from './partials/CalendarGrid';
import CalendarImg from './../assets/images/calendar-temp'

class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedYear: 2020 };
    this.changeYear = this.changeYear.bind(this);
    this.mobileChangeYear = this.mobileChangeYear.bind(this);
  }

  changeYear(clickedYear) {
    this.setState((prevState) => {
      event.stopPropagation();
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
    let calendar2020Blurb;
    if (this.state.selectedYear === 2020) {
      calendar2020Blurb = (
        <>
          <section className="container calendar-spotlight tight">
            <img src={CalendarImg} className="calendar-spotlight__image"/>
            <div className="calendar-spotlight__info">
              <p className="calendar-spotlight__paragraph">MAPC has for many years produced a wall calendar that provides recipients with insightful information about the region, in the form of a monthly map or data visualization. Each year, these monthly segments covered a wide variety of topics.</p>
              <p className="calendar-spotlight__paragraph">This year, we are moving to a new format, with two components: the print calendar and digital maps and data visualizations we will publish each month here on MAPC's MetroBoston DataCommon. We hope you will both hand this poseter on your wall, and visit datacommon.mapc.org to see a new map or data visualization on the first of each month.</p>
              <button className="calendar-spotlight__button"><a href="https://lp.constantcontact.com/su/Vab7XBS">Sign Up</a></button>
            </div>
          </section>
          <hr className="calendar-spotlight__divider"/>
        </>
      )
    }
    return (
      <section className="route Gallery">
        <YearNav
          selectedYear={this.state.selectedYear}
          changeYear={this.changeYear}
          mobileChangeYear={this.mobileChangeYear}
        />
        { calendar2020Blurb }
        <CalendarGrid
          selectedYear={this.state.selectedYear}
        />
      </section>
    );
  }
}

export default Gallery;
