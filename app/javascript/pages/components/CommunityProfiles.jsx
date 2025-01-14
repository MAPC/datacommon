import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Tab from './Tab';
import Dropdown from './field/Dropdown';
import MunicipalityPolygon from './MunicipalityPolygon';
import PieChart from '../containers/visualizations/PieChart';
import LineChart from '../containers/visualizations/LineChart';
import StackedAreaChart from '../containers/visualizations/StackedAreaChart';
import StackedBarChart from '../containers/visualizations/StackedBarChart';
import ChartDetails from './visualizations/ChartDetails';
import tabs from '../constants/tabs';
import charts from '../constants/charts';
import descriptions from '../constants/descriptions';
import capitalize from '../utils/capitalize';

const CommunityProfiles = (props) => {
  const { muni, tab } = useParams();

  const loadData = () => {
    if (charts[tab]) {
      Object.values(charts).forEach((tabCharts) => 
        Object.values(tabCharts).forEach((chart) => 
          props.fetchChartData(chart,muni)
        )
      );
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  return (
    <article className="component CommunityProfiles">
      <div className="page-header">
        <div className="container back-link">
          <Link to="community">{'< Back'}</Link>
        </div>
        <div className="container">
          <header>
            <h2>{capitalize(props.name)}</h2>
          </header>
          <section className="about">
            <div className="outline">
              <MunicipalityPolygon
                feature={props.municipalFeature}
              />
            </div>
            <div className="description-wrapper">
              <p className="description">
                {descriptions[props.muniSlug.toLowerCase()] || 'No description available.'}
              </p>
              <button onClick={() => (window.print())} type="button" className="print-button">Print charts</button>
            </div>
          </section>
        </div>
      </div>
      <div className="data">
        <div className="container tab-selection">
          <ul className="tabs">
            {tabs.map((tab) => (
              <li key={tab.value} className={tab.value == tab ? 'active' : ''}>
                <Link to={`/profile/${props.muniSlug}/${tab.value}`}>{tab.label}</Link>
              </li>
            ))}
          </ul>
          <div className="dropdown-wrapper">
            <Dropdown
              value={tab}
              options={tabs}
              onChange={(e) => props.push(`/profile/${props.muniSlug}/${e.target.value}`)}
            />
          </div>
        </div>
        <div className="box">
          <div className="container">
            <Tab active={tab == 'demographics'}>
              <header className="print-header">
                <h3>Demographics</h3>
              </header>
              <div className="tab__row">
                <ChartDetails chart={charts.demographics.race_ethnicity}>
                  <StackedBarChart
                    chart={charts.demographics.race_ethnicity}
                    muni={muni}
                  />
                </ChartDetails>
                <ChartDetails chart={charts.demographics.pop_by_age}>
                  <StackedBarChart
                    chart={charts.demographics.pop_by_age}
                    muni={muni}
                  />
                </ChartDetails>
              </div>
            </Tab>
            <Tab active={tab == 'economy'}>
              <header className="print-header">
                <h3>Economy</h3>
              </header>
              <div className="tab__row">
                <ChartDetails chart={charts.economy.resident_employment}>
                  <StackedBarChart
                    chart={charts.economy.resident_employment}
                    muni={muni}
                  />
                </ChartDetails>
                <ChartDetails chart={charts.economy.emp_by_sector}>
                  <StackedAreaChart
                    chart={charts.economy.emp_by_sector}
                    muni={muni}
                  />
                </ChartDetails>
              </div>
            </Tab>
            <Tab active={tab == 'education'}>
              <header className="print-header">
                <h3>Education</h3>
              </header>
              <div className="tab__row">
                <ChartDetails chart={charts.education.school_enrollment}>
                  <StackedBarChart
                    chart={charts.education.school_enrollment}
                    muni={muni}
                    horizontal
                  />
                </ChartDetails>
                <ChartDetails chart={charts.education.edu_attainment_by_race}>
                  <StackedBarChart
                    chart={charts.education.edu_attainment_by_race}
                    muni={muni}
                    horizontal
                    wrapLeftLabel
                  />
                </ChartDetails>
              </div>
            </Tab>
            <Tab active={tab == 'governance'}>
              <header className="print-header">
                <h3>Governance</h3>
              </header>
              <div className="tab__row">
                <ChartDetails chart={charts.governance.tax_levy}>
                  <PieChart
                    chart={charts.governance.tax_levy}
                    muni={muni}
                  />
                </ChartDetails>
              </div>
            </Tab>
            <Tab active={tab == 'environment'}>
              <header className="print-header">
                <h3>Environment</h3>
              </header>
              <div className="tab__row tab__row--break">
                <ChartDetails chart={charts.environment.water_usage_per_cap}>
                  <LineChart
                    chart={charts.environment.water_usage_per_cap}
                    muni={muni}
                  />
                </ChartDetails>
                <ChartDetails chart={charts.environment.energy_usage_gas}>
                  <StackedAreaChart
                    chart={charts.environment.energy_usage_gas}
                    muni={muni}
                  />
                </ChartDetails>
              </div>
              <div className="tab__row">
                <ChartDetails chart={charts.environment.energy_usage_electricity}>
                  <StackedAreaChart
                    chart={charts.environment.energy_usage_electricity}
                    muni={muni}
                  />
                </ChartDetails>
              </div>
            </Tab>
            <Tab active={tab == 'housing'}>
              <header className="print-header">
                <h3>Housing</h3>
              </header>
              <div className="tab__row">
                <ChartDetails chart={charts.housing.cost_burden}>
                  <StackedBarChart
                    chart={charts.housing.cost_burden}
                    muni={muni}
                  />
                </ChartDetails>
                <ChartDetails chart={charts.housing.units_permitted}>
                  <StackedBarChart
                    chart={charts.housing.units_permitted}
                    muni={muni}
                  />
                </ChartDetails>
              </div>
            </Tab>
            <Tab active={tab == 'public-health'}>
              <header className="print-header">
                <h3>Public Health</h3>
              </header>
              <div className="tab__row">
                <ChartDetails chart={charts['public-health'].premature_mortality_rate}>
                  <StackedBarChart
                    chart={charts['public-health'].premature_mortality_rate}
                    muni={muni}
                  />
                </ChartDetails>
                <ChartDetails chart={charts['public-health'].hospitalizations}>
                  <StackedBarChart
                    chart={charts['public-health'].hospitalizations}
                    muni={muni}
                  />
                </ChartDetails>
              </div>
            </Tab>
            <Tab active={tab == 'transportation'}>
              <header className="print-header">
                <h3>Transportation</h3>
              </header>
              <div className="tab__row">
                <ChartDetails chart={charts.transportation.daily_vmt}>
                  <StackedAreaChart
                    chart={charts.transportation.daily_vmt}
                    muni={muni}
                  />
                </ChartDetails>
                <ChartDetails chart={charts.transportation.commute_to_work}>
                  <PieChart
                    chart={charts.transportation.commute_to_work}
                    muni={muni}
                  />
                </ChartDetails>
              </div>
            </Tab>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CommunityProfiles;
