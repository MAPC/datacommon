import React from 'react';
import axios from 'axios';
import DataRow from './DataRow';

export default class DataViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qryBase: 'https://prql.mapc.org/',
      qryToken: '16a2637ee33572e46f5609a578b035dc',
      qryTable: '',
      qryLimitYears: '',
      qrySchemaName: '',
      qryYearColumn: '',
      headers: [],
      rows: [],
      acsYears: [],
    };
  }

  componentDidMount() {
    this.props.fetchDatasets().then((datasets) => {
      const selectedDataset = this.props.match.params.id;
      const fullDataset = datasets.datasets.filter((dataset) => !dataset.seq_id === !selectedDataset)[0];
      console.log(fullDataset);
      this.setState({
        qryTable: fullDataset.table_name,
        qrySchemaName: fullDataset.schemaname,
        qryYearColumn: fullDataset.yearcolumn,
      });
      const {
        qryBase,
        qryToken,
        qryTable,
        qryLimitYears,
        qryYearColumn,
        qrySchemaName,
      } = this.state;
      const acsYearQuery = `${qryBase}?query=select distinct(${qryYearColumn}) from ${qrySchemaName}.${qryTable} LIMIT 2050&token=${qryToken}`;
      const tableQuery = `${qryBase}?query=select * from tabular.${qryTable} order by acs_year DESC LIMIT 15000&token=${qryToken}`;

      axios.all([axios.get(acsYearQuery), axios.get(tableQuery)]).then(response => {
        this.setState({
          acsYears: response[0].data.rows,
          rows: response[1].data.rows,
          headers: Object.keys(response[1].data.rows[0]),
        });
      });
    })
  }


  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { rows, headers } = this.state;
    const filteredHeaders = headers.filter((header) => header !== 'shape');
    const renderedHeaders = filteredHeaders.map((header) => <th className="ui table" key={header}>{header}</th>);
    const renderedRows = rows.map((row) => <DataRow key={row.shape} rowData={row} headers={filteredHeaders} />);

    // console.log('headers: ', headers);
    // console.log('filteredHeaders: ', filteredHeaders);
    // console.log('renderedHeaders: ', renderedHeaders);
    // console.log('rows: ', rows);

    const renderedTable = (
      <table className="ui table">
        <thead>
          <tr>{renderedHeaders}</tr>
        </thead>
        <tbody>
          {renderedRows}
        </tbody>
      </table>
    );

    return (
      <div className="table-wrapper">
        <div className="container tight">
          {renderedTable}
        </div>
      </div>
    );
  }
}
