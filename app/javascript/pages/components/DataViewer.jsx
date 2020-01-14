/* eslint-disable max-len */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from 'react';
import axios from 'axios';
import DatasetHeader from './partials/DatasetHeader';
import DatasetTable from './partials/DatasetTable';

export default class DataViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      availableYears: [],
      table: '',
      schema: '',
      database: '',
      queryYearColumn: '',
      displayHeaders: [],
      rowHeaders: [],
      rows: [],
      title: '',
      source: '',
      universe: '',
      description: '',
      metadata: {},
      selectedYears: [],
      currentPage: 1,
    };
    this.updateSelectedYears = this.updateSelectedYears.bind(this);
    this.updatePage = this.updatePage.bind(this);
  }

  componentDidMount() {
    const queryBase = 'https://prql.mapc.org/';
    const queryToken = '16a2637ee33572e46f5609a578b035dc';
    this.props.fetchDatasets().then((storeResponse) => {
      const fullDataset = storeResponse.datasets.filter((dataset) => +dataset.seq_id === +this.props.match.params.id)[0];
      const table = fullDataset.table_name;
      const schema = fullDataset.schemaname;
      const database = fullDataset.db_name;
      const title = fullDataset.menu3;
      const source = fullDataset.source;
      const queryYearColumn = fullDataset.yearcolumn;
      const yearQuery = axios.get(`${queryBase}?query=select distinct(${queryYearColumn}) from ${schema}.${table} LIMIT 50&token=${queryToken}`);
      const tableQuery = axios.get(`${queryBase}?query=select * from ${schema}.${table} order by ${queryYearColumn} DESC LIMIT 15000&token=${queryToken}`);
      const headerQuery = axios.get(`/${database}?tables=${table}`, { headers: { 'Access-Control-Allow-Origin': '*' } });
      axios.all([yearQuery, tableQuery, headerQuery]).then((response) => {
        const yearResults = response[0];
        const tableResults = response[1];
        const metadata = Object.values(response[2].data)[0];

        const displayHeaders = Object.keys(tableResults.data.fields)
          .filter((header) => metadata.find((element) => element.name === header))
          .map((header) => metadata.find((element) => element.name === header).alias);

        this.setState({
          availableYears: yearResults.data.rows.map((year) => Object.values(year)[0]).sort().reverse(),
          rows: tableResults.data.rows,
          rowHeaders: Object.keys(tableResults.data.rows[0]),
          displayHeaders,
          universe: metadata.filter((row) => row.name === 'universe')[0].details,
          description: metadata.filter((row) => row.name === 'descriptn')[0].details,
          metadata,
          selectedYears: [yearResults.data.rows.map((year) => Object.values(year)[0]).sort().reverse()[0]],
          table,
          schema,
          database,
          title,
          source,
          queryYearColumn,
        });
      });
    });
  }

  updateSelectedYears(e, year) {
    this.setState((prevState) => {
      if (prevState.selectedYears.includes(year)) {
        const index = prevState.selectedYears.indexOf(year);
        const front = prevState.selectedYears.slice(0, index);
        const back = prevState.selectedYears.slice(index + 1);
        const newArray = front.concat(back);
        return { selectedYears: newArray };
      }
      prevState.selectedYears.push(year);
      return { selectedYears: prevState.selectedYears };
    });
  }

  updatePage(e, action, numOfPages = 1) {
    this.setState((prevState) => {
      let updatedPage;
      if (action === 'Forward') {
        updatedPage = prevState.currentPage + 1;
      } else if (action === 'Backward') {
        updatedPage = prevState.currentPage - 1;
      } else if (action === 'Beginning') {
        updatedPage = 1;
      } else if (action === 'End') {
        updatedPage = numOfPages;
      }
      return { currentPage: updatedPage };
    });
  }

  render() {
    return (
      <section className="datasets">
        <DatasetHeader
          title={this.state.title}
          source={this.state.source}
          universe={this.state.universe}
          availableYears={this.state.availableYears}
          description={this.state.description}
          metadata={this.state.metadata}
          schema={this.state.schema}
          table={this.state.table}
          database={this.state.database}
          updateSelectedYears={this.updateSelectedYears}
          queryYearColumn={this.state.queryYearColumn}
          selectedYears={this.state.selectedYears}
        />
        <DatasetTable
          rows={this.state.rows}
          displayHeaders={this.state.displayHeaders}
          rowHeaders={this.state.rowHeaders}
          queryYearColumn={this.state.queryYearColumn}
          currentPage={this.state.currentPage}
          selectedYears={this.state.selectedYears}
          updatePage={this.updatePage}
        />
      </section>
    );
  }
}
