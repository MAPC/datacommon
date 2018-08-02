import React from 'react';
import { Link } from 'react-router-dom';
import MunicipalityPolygon from './MunicipalityPolygon';
import PieChart from '~/app/containers/visualizations/PieChart';
import HorizontalStack from '~/app/containers/visualizations/HorizontalStack';
import Tab from './Tab';
import Dropdown from './field/Dropdown';
import LineChart from '~/app/containers/visualizations/LineChart';
import charts from '~/app/constants/charts';

import tabs from './../constants/tabs';

class CommunityProfiles extends React.Component {

  componentWillMount() {
    const chartList = charts[this.props.tabSlug];
    if (chartList && chartList.length) {
      chartList.forEach(chart => {
        this.props.fetchChartData(chart.table, Object.keys(chart.columns).join(','))
      });
    }

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
                <PieChart
                  chart={charts['demographics'][0]}
                  muni={this.props.muniSlug}
                />
                <LineChart />
              </Tab>
              <Tab active={this.props.tabSlug == 'economy'}>
              </Tab>
              <Tab active={this.props.tabSlug == 'education'}>
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
              </Tab>
            </div>
          </div>
        </div>

      </article>
    );
  }

}

export default CommunityProfiles;
