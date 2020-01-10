/* eslint-disable max-len */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from 'react';
import axios from 'axios';
import DataRow from './DataRow';
import DatasetHeader from './DatasetHeader';

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

  render() {
    const { rows, displayHeaders, rowHeaders, queryYearColumn } = this.state;
    const filteredHeaders = displayHeaders.filter((header) => header !== 'shape');
    const updatedRowHeaders = rowHeaders.filter((header) => header !== 'shape');
    const renderedHeaders = filteredHeaders.map((header) => <th className="ui table " key={header}>{header}</th>);
    const renderedRows = rows.filter((row) => this.state.selectedYears.includes(row[queryYearColumn]))
      .map((row) => <DataRow key={row.seq_id} rowData={row} headers={updatedRowHeaders} />);
    const renderedTable = (
      <table className="ui sortable unstackable selectable compact table ember-view">
        <thead>
          <tr>{renderedHeaders}</tr>
        </thead>
        <tbody>
          {renderedRows}
        </tbody>
      </table>
    );

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
        <div className="table-wrapper">
          <div className="container tight">
            <div className="scroll-horizontal-rotated ui lift">
              <div className="cancel-rotate">
                {renderedTable}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
