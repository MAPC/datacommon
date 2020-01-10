/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function downloadMetadata(e, metadata) {
  e.preventDefault();
  const keys = Object.keys(metadata[0]);
  const values = metadata.map((row) => keys.map((key) => row[key]));
  const rows = values.map((row) => row.reduce((a, b) => `${a},${b}`));

  const csvHeader = 'data:text/csv;charset=utf-8,';

  const documentHeader = keys;
  const documentRows = rows.reduce((a, b) => `${a}\n${b}`);

  const documentStructure = [[documentHeader], documentRows].reduce((a, b) => a.concat(b));
  const documentBody = documentStructure.reduce((a, b) => `${a}\n${b}`);

  const csvFile = csvHeader + documentBody;
  const encoded = encodeURI(csvFile);
  const fileName = `${metadata.find((data) => data.alias === 'Title').details}-metadata.csv`;

  const link = document.createElement('a');
  link.setAttribute('href', encoded);
  link.setAttribute('download', fileName);

  document.body.appendChild(link);
  link.click();
}

function downloadData(schema, table, database, selectedYears, queryYearColumn) {
  const yearString = selectedYears.join();
  return `/csv?table=${schema}.${table}&database=${database}&years=${yearString}&year_col=${queryYearColumn}`
}

function DatasetHeader({
  title, table, source, universe, description, availableYears, metadata, schema, database, updateSelectedYears, queryYearColumn, selectedYears,
}) {
  return (
    <div className="page-header">
      <div className="container back-link">
        <Link to="/datasets" className="back-link">{'< Back'}</Link>
      </div>
      <div className="container tight">
        <h2>{title}</h2>
        <div className="dataset-details-content">
          <div className="details-content-column">
            <ul className="table-meta">
              <li>
                Table:
                <em>{` ${table}`}</em>
              </li>
              <li>
                Source:
                <em>{` ${source}`}</em>
              </li>
              <li>
                Universe:
                <em>{` ${universe}`}</em>
              </li>
              <li>
                Description:
                <em>{` ${description}`}</em>
              </li>
            </ul>
            <div className="year-filter">
              <span>Select Years:</span>
              <ul>
                { availableYears.map((year) => <li key={year.toString()} onClick={(e) => updateSelectedYears(e, year)} className={selectedYears.includes(year) ? 'selected' : ''}>{year}</li>) }
              </ul>
            </div>
          </div>
          <div className="details-content-column download-links">
            Download:
            <div className="download-buttons gradient-4">
              <a className="button lift" onClick={(e) => downloadMetadata(e, metadata)}>metadata</a>
              <a className="button lift" href={downloadData(schema, table, database, selectedYears, queryYearColumn)} download={table}>.csv</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

DatasetHeader.propTypes = {
  title: PropTypes.string.isRequired,
  table: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  universe: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  availableYears: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default DatasetHeader;
