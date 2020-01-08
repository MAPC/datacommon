import React from 'react';
import DataRow from './DataRow';
import axios from 'axios';

export default class DataViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // dataKey: props.dataKey,
      // query: 'https://prql.mapc.org/?query=select%20*%20from%20mapc.malden_zoning_base%20%20LIMIT%2050;&token=1b9b9a1d1738c3dce14331040fa17008',
      qryBase: 'https://prql.mapc.org/',
      qryToken: '1b9b9a1d1738c3dce14331040fa17008',
      qryTable: 'mapc.malden_zoning_base',
      qryLimitYears: '2010',
      headers: [],
      rows: [],
    };
  }

  componentDidMount() {
    const {
      qryBase,
      qryToken,
      qryTable,
      qryLimitYears,
    } = this.state;

    const query = `${qryBase}?query=select%20*%20from%20${qryTable}%20%20LIMIT%${qryLimitYears};&token=${qryToken}`;

    axios.get(query)
      .then((response) => {
        this.setState({
          rows: response.data.rows,
          headers: Object.keys(response.data.rows[0]),
        });
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { rows, headers } = this.state;
    const filteredHeaders = headers.filter((header) => header !== 'shape');
    const renderedHeaders = filteredHeaders.map((header) => <th className="ui table" key={header}>{header}</th>);
    const renderedRows = rows.map((row) => <DataRow key={row.shape} rowData={row} headers={filteredHeaders} />);

    console.log('headers: ', headers);
    console.log('filteredHeaders: ', filteredHeaders);
    console.log('renderedHeaders: ', renderedHeaders);
    console.log('rows: ', rows);

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
