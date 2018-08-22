import React from 'react';
import { Link } from 'react-router-dom';

import Tab from './Tab';
import Dropdown from './field/Dropdown';
import MunicipalityPolygon from './MunicipalityPolygon';
import PieChart from '~/app/containers/visualizations/PieChart';
import LineChart from '~/app/containers/visualizations/LineChart';
import StackedAreaChart from '~/app/containers/visualizations/StackedAreaChart';
import StackedBarChart from '~/app/containers/visualizations/StackedBarChart';
import ChartDetails from '~/app/components/visualizations/ChartDetails';

import tabs from './../constants/tabs';
import charts from '~/app/constants/charts';


class CommunityProfiles extends React.Component {

  constructor() {
    super(...arguments);

    this.loadData = this.loadData.bind(this);
  }

  loadData() {
    if (charts[this.props.match.params.tab]) {
      Object.values(charts[this.props.match.params.tab])
          .forEach(chart => this.props.fetchChartData(chart));
    }
  }

  componentWillMount() {
    this.loadData();
  }

  componentDidUpdate() {
    this.loadData();
  }

  render() {
    return (
      <article className="component CommunityProfiles">

        <div className="page-header">
          <div className="container back-link">
            <Link to={'/'} >{'< Back'}</Link>
          </div>
          <div className="container">
            <header>
              <h2>{this.props.name}</h2>
            </header>
            <section className="about">
              <div className="outline">
                <MunicipalityPolygon
                  feature={this.props.municipalFeature}
                />
              </div>
              <div className="description">
                .nerdlihc ega-loohcs fo erahs gniworg a htiw ,elbats dna esrevid yletaredom si noitalupop eht ,eroC orteM eht naht tneu a eroM .serutcurts gnitsixe fo noisnapxe dna ll ni dna tnempoleveder detimil hguorht srucco htworg weN .gnisuoh ylimafitlum dezis-dim dna ,sesuoh ylimaf 4 – 2 ,semoh ylimaf elgnis fo xim a htiw sdoohrobhgien laitnediser detneiro -tisnart dna -egalliv esirpmoc seitinummoc ese  .brubuS racteertS a sa CPAM yb dezirogetac si mahtlaW
              </div>
            </section>
          </div>
        </div>

        <div className="data">
          <div className="container">
            <ul className="tabs">
              {tabs.map((tab) => (
                <li key={tab.value} className={this.props.tabSlug == tab.value ? 'active' : ''}>
                  <Link to={`/profile/${this.props.muniSlug}/${tab.value}`}>{tab.label}</Link>
                </li>
              ))}
            </ul>
            <div className="dropdown-wrapper">
              <Dropdown
                value={this.props.tabSlug}
                options={tabs}
                onChange={(e) => this.props.push(`/profile/${this.props.muniSlug}/${e.target.value}`)}
              />
            </div>
          </div>
          <div className="box">
            <div className="container">
              <Tab active={this.props.tabSlug == 'demographics'}>
                <div className="tab-row">
                  <ChartDetails chart={charts['demographics']['race_ethnicity']}>
                    <StackedBarChart
                      chart={charts['demographics']['race_ethnicity']}
                      muni={this.props.match.params.muni}
                    />
                  </ChartDetails>
                  <ChartDetails chart={charts['demographics']['pop_by_age']}>
                    <StackedBarChart
                      chart={charts['demographics']['pop_by_age']}
                      muni={this.props.match.params.muni}
                    />
                  </ChartDetails>
                </div>
              </Tab>
              <Tab active={this.props.tabSlug == 'economy'}>
                <div className="tab-row">
                  <ChartDetails chart={charts['economy']['resident_employment']}>
                    <StackedBarChart
                      chart={charts['economy']['resident_employment']}
                      muni={this.props.match.params.muni}
                    />
                  </ChartDetails>
                  <ChartDetails chart={charts['economy']['emp_by_sector']}>
                    <StackedAreaChart
                      chart={charts['economy']['emp_by_sector']}
                      muni={this.props.match.params.muni}
                    />
                  </ChartDetails>
                </div>
              </Tab>
              <Tab active={this.props.tabSlug == 'education'}>
                <div className="tab-row">
                  <ChartDetails chart={charts['education']['school_enrollment']}>
                    <StackedBarChart
                      chart={charts['education']['school_enrollment']}
                      muni={this.props.match.params.muni}
                      horizontal={true}
                    />
                  </ChartDetails>
                  <ChartDetails chart={charts['education']['edu_attainment_by_race']}>
                    <StackedBarChart
                      chart={charts['education']['edu_attainment_by_race']}
                      muni={this.props.match.params.muni}
                      horizontal={true}
                    />
                  </ChartDetails>
                </div>
              </Tab>
              <Tab active={this.props.tabSlug == 'governance'}>
                <div className="tab-row">
                  <ChartDetails chart={charts['governance']['tax_levy']}>
                    <PieChart
                      chart={charts['governance']['tax_levy']}
                      muni={this.props.match.params.muni}
                    />
                  </ChartDetails>
                </div>
              </Tab>
              <Tab active={this.props.tabSlug == 'environment'}>
                <div className="tab-row">
                  <ChartDetails chart={charts['environment']['water_usage_per_cap']}>
                    <LineChart
                      chart={charts['environment']['water_usage_per_cap']}
                      muni={this.props.match.params.muni}
                    />
                  </ChartDetails>
                  <ChartDetails chart={charts['environment']['energy_usage_gas']}>
                    <StackedAreaChart
                      chart={charts['environment']['energy_usage_gas']}
                      muni={this.props.match.params.muni}
                    />
                  </ChartDetails>
                  <ChartDetails chart={charts['environment']['energy_usage_electricity']}>
                    <StackedAreaChart
                      chart={charts['environment']['energy_usage_electricity']}
                      muni={this.props.match.params.muni}
                    />
                  </ChartDetails>
                </div>
              </Tab>
              <Tab active={this.props.tabSlug == 'housing'}>
                <div className="tab-row">
                  <ChartDetails chart={charts['housing']['cost_burden']}>
                    <StackedBarChart
                      chart={charts['housing']['cost_burden']}
                      muni={this.props.match.params.muni}
                    />
                  </ChartDetails>
                  <ChartDetails chart={charts['housing']['units_permitted']}>
                    <StackedBarChart
                      chart={charts['housing']['units_permitted']}
                      muni={this.props.match.params.muni}
                    />
                  </ChartDetails>
                </div>
              </Tab>
              <Tab active={this.props.tabSlug == 'public-health'}>
                <div className="tab-row">
                  <ChartDetails chart={charts['public-health']['premature_mortality_rate']}>
                    <StackedBarChart
                      chart={charts['public-health']['premature_mortality_rate']}
                      muni={this.props.match.params.muni}
                    />
                  </ChartDetails>
                  <ChartDetails chart={charts['public-health']['hospitalizations']}>
                    <StackedBarChart
                      chart={charts['public-health']['hospitalizations']}
                      muni={this.props.match.params.muni}
                    />
                  </ChartDetails>
                </div>
              </Tab>
              <Tab active={this.props.tabSlug == 'transportation'}>
                <div className="tab-row">
                  <ChartDetails chart={charts['transportation']['daily_vmt']}>
                    <StackedAreaChart
                      chart={charts['transportation']['daily_vmt']}
                      muni={this.props.match.params.muni}
                    />
                  </ChartDetails>
                  <ChartDetails chart={charts['transportation']['commute_to_work']}>
                    <PieChart
                      chart={charts['transportation']['commute_to_work']}
                      muni={this.props.match.params.muni}
                    />
                  </ChartDetails>
                </div>
              </Tab>
            </div>
          </div>
        </div>

      </article>
    );
  }
}

export default CommunityProfiles;
