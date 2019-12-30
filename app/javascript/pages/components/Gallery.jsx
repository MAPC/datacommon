import React from 'react';
import YearNav from './partials/YearNav';
import CalendarGrid from './partials/CalendarGrid';
import CalendarImg from '../assets/images/calendar-temp.png';

class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedYear: 2020 };
    this.changeYear = this.changeYear.bind(this);
    this.mobileChangeYear = this.mobileChangeYear.bind(this);
  }

  changeYear(clickedYear) {
    this.setState((prevState) => {
      // event.stopPropagation();
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
            <a href='/files/final-mapc-calendar-2020.pdf' download>
              <div className="calendar-spotlight__image-wrapper">
                <img src={CalendarImg} className="calendar-spotlight__image"/>
                <h2 className="calendar-spotlight__image--after">Download 2020 Wall Calendar</h2>
              </div>
            </a>
            <div className="calendar-spotlight__info">
              <p>Welcome to the MAPC 2020 Calendar — which for the first time this year is in the form of a monthly digital publication and a beautiful year-at-a-glance printed poster. Our monthly maps and data visualizations will be, as ever,  insightful, visually arresting, and will cover a range of vital topics.</p>
              <p>Visit us each month at MAPC’s MetroBoston Data Common to see what’s new!</p>
              <button className="calendar-spotlight__button"><a href="https://lp.constantcontact.com/su/Vab7XBS">Sign Up</a></button>
            </div>
          </section>
          <hr className="calendar-spotlight__divider" />
        </>
      );
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
