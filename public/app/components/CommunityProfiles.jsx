import React from 'react';
import { Link } from 'react-router-dom';

import Tab from './Tab';
import Dropdown from './field/Dropdown';
import MunicipalityPolygon from './MunicipalityPolygon';
import PieChart from '~/app/containers/visualizations/PieChart';
import LineChart from '~/app/containers/visualizations/LineChart';
import StackedAreaChart from '~/app/containers/visualizations/StackedAreaChart';
import PercentStackedBarChart from '~/app/containers/visualizations/PercentStackedBarChart';
import HorizontalStackedBarChart from '~/app/containers/visualizations/HorizontalStackedBarChart';

import tabs from './../constants/tabs';
import charts from '~/app/constants/charts';


class CommunityProfiles extends React.Component {

  constructor() {
    super(...arguments);

    this.loadData = this.loadData.bind(this);
  }

  loadData() {
    (charts[this.props.match.params.tab] || []).forEach(chart => {
      this.props.fetchChartData(chart);
    });
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
              <h1>{this.props.name}</h1>
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
            <div className="box">
              <Tab active={this.props.tabSlug == 'demographics'}>
                <LineChart />
              </Tab>
              <Tab active={this.props.tabSlug == 'economy'}>
                <StackedAreaChart
                  chart={charts['economy'][0]}
                  muni={this.props.match.params.muni}
                />
              </Tab>
              <Tab active={this.props.tabSlug == 'education'}>
                <HorizontalStackedBarChart />
              </Tab>
              <Tab active={this.props.tabSlug == 'governance'}>
              </Tab>
              <Tab active={this.props.tabSlug == 'environment'}>
              </Tab>
              <Tab active={this.props.tabSlug == 'housing'}>
              </Tab>
              <Tab active={this.props.tabSlug == 'public-health'}>
              </Tab>
              <Tab active={this.props.tabSlug == 'transportation'}>
                <PieChart
                  chart={charts['transportation'][0]}
                  muni={this.props.match.params.muni}
                />
              </Tab>
            </div>
          </div>
        </div>

      </article>
    );
  }

}

export default CommunityProfiles;
