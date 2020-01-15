import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function downloadMetadata(e, database, metadata, title, table = '', description = '') {
  e.preventDefault();
  const documentHeader = ['name', 'alias', 'details'];
  let rows;
  if (database === 'towndata') {
    const metadataName = metadata.documentation.metadata.eainfo.detailed.attr.map((attr) => (attr.attlabl ? attr.attlabel : 'undefined'));
    const metadataAlias = metadata.documentation.metadata.eainfo.detailed.attr.map((attr) => attr.attalias);
    const metadataDescription = metadata.documentation.metadata.eainfo.detailed.attr.map((attr) => (attr.attrdef ? attr.attrdef : 'undefined'));
    rows = [
      ['title', 'Title', title],
      ['tbl_table', 'Table', table],
      ['descriptn', 'Description', description],
    ].concat(metadataName.map((item, i) => [item, metadataAlias[i], metadataDescription[i]]));
  } else {
    const values = metadata.map((row) => documentHeader.map((key) => row[key]));
    rows = values.map((row) => row.reduce((a, b) => `${a},${b}`));
  }
  const csvHeader = 'data:text/csv;charset=utf-8,';
  const documentRows = rows.reduce((a, b) => `${a}\n${b}`);

  const documentStructure = [[documentHeader], documentRows].reduce((a, b) => a.concat(b));
  const documentBody = documentStructure.reduce((a, b) => `${a}\n${b}`);

  const csvFile = csvHeader + documentBody;
  const encoded = encodeURI(csvFile);
  const fileName = `${title}-metadata.csv`;

  const link = document.createElement('a');
  link.setAttribute('href', encoded);
  link.setAttribute('download', fileName);

  document.body.appendChild(link);
  link.click();
}

function downloadCsv(schema, table, database, selectedYears = [], queryYearColumn = '') {
  const yearString = selectedYears.join();
  if (selectedYears.length > 0 && queryYearColumn !== '') {
    return `/csv?table=${schema}.${table}&database=${database}&years=${yearString}&year_col=${queryYearColumn}`;
  }
  return `/csv?table=${schema}.${table}&database=${database}`;
}

function downloadShp(database, schema, table) {
  return `/shapefile?table=${database}.${schema}.${table}&database=${database}`;
}

function setDownloadLinks(metadata, schema, table, title, description, selectedYears, queryYearColumn, database) {
  if (database === 'towndata') {
    return (
      <div className="details-content-column download-links">
        Download:
        <div className="download-buttons gradient-4">
          <a className="button lift" onClick={(e) => downloadMetadata(e, database, metadata, title, table, description)}>metadata</a>
          <a className="button lift" href={downloadCsv(schema, table, database)} download={table}>.csv</a>
          <a className="button lift" href={downloadShp(database, schema, table)} download={table}>.shp</a>
        </div>
      </div>
    );
  }
  return (
    <div className="details-content-column download-links">
      Download:
      <div className="download-buttons gradient-4">
        <a className="button lift" onClick={(e) => downloadMetadata(e, database, metadata, title)}>metadata</a>
        <a className="button lift" href={downloadCsv(schema, table, database, selectedYears, queryYearColumn)} download={table}>.csv</a>
      </div>
    </div>
  );
}

function setSelectYears(availableYears, updateSelectedYears, selectedYears) {
  if (availableYears.length > 0) {
    return (
      <div className="year-filter">
        <span>Select Years:</span>
        <ul>
          { availableYears.map((year) => <li key={year.toString()} onClick={(e) => updateSelectedYears(e, year)} className={selectedYears.includes(year) ? 'selected' : ''}>{year}</li>) }
        </ul>
      </div>
    );
  }
  return null;
}

function setUniverse(universe) {
  if (universe) {
    return (
      <li>
        Universe:
        <em>{` ${universe}`}</em>
      </li>
    );
  }
  return null;
}

function DatasetHeader({
  title, table, source, universe, description, availableYears, metadata, schema, database, updateSelectedYears, queryYearColumn, selectedYears,
}) {
  return (
    <div className="page-header">
      <div className="container back-link">
        <Link to="/browser" className="back-link">{'< Back'}</Link>
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
              { setUniverse(universe) }
              <li>
                Description:
                <em>{` ${description}`}</em>
              </li>
            </ul>
            { setSelectYears(availableYears, updateSelectedYears, selectedYears) }
          </div>
          { setDownloadLinks(metadata, schema, table, title, description, selectedYears, queryYearColumn, database) }
        </div>
      </div>
    </div>
  );
}

DatasetHeader.propTypes = {
  availableYears: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  database: PropTypes.string,
  description: PropTypes.string,
  metadata: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.objectOf(PropTypes.object),
  ]),
  queryYearColumn: PropTypes.string,
  schema: PropTypes.string,
  selectedYears: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  source: PropTypes.string,
  table: PropTypes.string,
  title: PropTypes.string,
  updateSelectedYears: PropTypes.func.isRequired,
  universe: PropTypes.string,
};

DatasetHeader.defaultProps = {
  availableYears: [],
  database: 'ds',
  description: '',
  metadata: [],
  queryYearColumn: '',
  schema: '',
  selectedYears: [],
  source: '',
  table: '',
  title: '',
  universe: '',
};

export default DatasetHeader;
