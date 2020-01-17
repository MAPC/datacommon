import React from 'react';
import axios from 'axios';
import { css } from '@emotion/core';
import MoonLoader from 'react-spinners/MoonLoader';
import DatasetHeader from './partials/DatasetHeader';
import DatasetTable from './partials/DatasetTable';

const override = css`
  height: 3.5rem;
  margin-bottom: .5rem;
  width: 3.5rem;
`;

export default class DataViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      loading: true,
    };
    this.updateSelectedYears = this.updateSelectedYears.bind(this);
    this.updatePage = this.updatePage.bind(this);
  }

  componentDidMount() {
    const queryBase = 'https://prql.mapc.org/';
    const queryToken = {
      ds: '16a2637ee33572e46f5609a578b035dc',
      gisdata: 'e2e3101e16208f04f7415e36052ce59b',
      towndata: '1b9b9a1d1738c3dce14331040fa17008',
    };

    this.props.fetchDatasets().then((storeResponse) => {
      const dataset = storeResponse.datasets.filter((datasetObj) => +datasetObj.seq_id === +this.props.match.params.id)[0];
      const tableQuery = axios.get(`${queryBase}?token=${queryToken[dataset.db_name]}&query=SELECT * FROM ${dataset.schemaname}.${dataset.table_name} ${dataset.yearcolumn ? `ORDER BY ${dataset.yearcolumn} DESC` : ''} LIMIT 15000`);
      const headerQuery = axios.get(`/${dataset.db_name}?tables=${dataset.table_name}`);

      if (dataset.schemaname === 'tabular') {
        if (dataset.yearcolumn) {
          const yearQuery = axios.get(`${queryBase}?query=select distinct(${dataset.yearcolumn}) from ${dataset.schemaname}.${dataset.table_name} LIMIT 50&token=${queryToken[dataset.db_name]}`);
          axios.all([yearQuery, tableQuery, headerQuery]).then((response) => {
            const yearResults = response[0];
            const tableResults = response[1];
            const metadata = Object.values(response[2].data)[0];
            this.setState({
              availableYears: yearResults.data.rows.map((year) => Object.values(year)[0]).sort().reverse(),
              rows: tableResults.data.rows,
              universe: metadata.filter((row) => row.name === 'universe')[0].details,
              description: metadata.filter((row) => row.name === 'descriptn')[0].details,
              columnKeys: metadata.filter((object) => Object.keys(tableResults.data.rows[0]).includes(object.name))
                .filter((header) => header.name !== 'seq_id'),
              metadata,
              selectedYears: [yearResults.data.rows.map((year) => Object.values(year)[0]).sort().reverse()[0]],
              table: dataset.table_name,
              schema: dataset.schemaname,
              database: dataset.db_name,
              title: dataset.menu3,
              source: dataset.source,
              queryYearColumn: dataset.yearcolumn,
              loading: false,
            });
          });
        } else {
          axios.all([tableQuery, headerQuery]).then((response) => {
            const tableResults = response[0];
            const metadata = Object.values(response[1].data)[0];
            this.setState({
              rows: tableResults.data.rows,
              universe: metadata.filter((row) => row.name === 'universe')[0].details,
              description: metadata.filter((row) => row.name === 'descriptn')[0].details,
              columnKeys: metadata.filter((object) => Object.keys(tableResults.data.rows[0]).includes(object.name))
                .filter((header) => header.name !== 'seq_id'),
              metadata,
              table: dataset.table_name,
              schema: dataset.schemaname,
              database: dataset.db_name,
              title: dataset.menu3,
              source: dataset.source,
              queryYearColumn: dataset.yearcolumn,
              loading: false,
            });
          });
        }
      } else {
        axios.all([tableQuery, headerQuery]).then((response) => {
          const tableResults = response[0];
          const metadata = Object.values(response[1].data)[0];
          const columns = Object.keys(tableResults.data.rows[0]);
          const sortedMetadata = metadata.documentation.metadata.eainfo.detailed.attr.map((attribute) => ({ name: attribute.attrlabl, alias: attribute.attalias }))
            .filter((header) => columns.includes(header.name))
            .filter((header) => header.name !== 'shape');
          this.setState({
            rows: tableResults.data.rows,
            columnKeys: sortedMetadata,
            metadata,
            description: metadata.documentation.metadata.dataIdInfo.idPurp,
            schema: dataset.schemaname,
            source: dataset.source,
            database: dataset.db_name,
            table: dataset.table_name,
            title: dataset.menu3,
            loading: false,
          });
        });
      }
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
    let pageContents;
    if (this.state.loading) {
      pageContents = (
          <div className="moonloader__wrapper">
            <MoonLoader
              size={'56px'}
              css={override}
              color={'#767676'}
              loading={this.state.loading}
            />
            Fetching Data
          </div>
      );
    } else {
      pageContents = (
        <section className="datasets">
          <DatasetHeader
            availableYears={this.state.availableYears}
            database={this.state.database}
            description={this.state.description}
            metadata={this.state.metadata}
            queryYearColumn={this.state.queryYearColumn}
            schema={this.state.schema}
            selectedYears={this.state.selectedYears}
            source={this.state.source}
            table={this.state.table}
            title={this.state.title}
            updateSelectedYears={this.updateSelectedYears}
            universe={this.state.universe}
          />
          <DatasetTable
            currentPage={this.state.currentPage}
            columnKeys={this.state.columnKeys}
            rows={this.state.rows}
            queryYearColumn={this.state.queryYearColumn}
            selectedYears={this.state.selectedYears}
            updatePage={this.updatePage}
            metadata={this.state.metadata}
          />
        </section>
      );
    }
    return (
      <>
        {pageContents}
      </>
    );
  }
}
