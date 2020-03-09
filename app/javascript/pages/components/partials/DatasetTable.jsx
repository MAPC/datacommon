import React from 'react';
import PropTypes from 'prop-types';
import DataRow from './DataRow';

function setTableHeaders(columnKeys) {
  return columnKeys.map((header) => (
    <th className="ui table" key={header.alias}>
      {header.alias}
    </th>
  ));
}

function DatasetTable({
  columnKeys, currentPage, metadata, queryYearColumn, rows, selectedYears, updatePage,
}) {
  const renderedHeaders = setTableHeaders(columnKeys);
  let allRows;
  if (queryYearColumn) {
    allRows = rows.filter((row) => selectedYears.includes(row[queryYearColumn]))
      .map((row, i) => <DataRow key={i} rowData={row} headers={columnKeys.map((key) => key.name)} />);
  } else {
    allRows = rows.map((row, i) => <DataRow key={i} rowData={row} headers={columnKeys.map((key) => key.name)} />);
  }

  const renderedRows = allRows.slice((currentPage - 1) * 50, currentPage * 50);
  const numOfPages = Math.ceil(allRows.length / 50);
  const backButtonClasses = currentPage === 1 ? 'button-wrapper lift disabled' : 'button-wrapper lift';
  const forwardButtonClasses = currentPage === numOfPages ? 'button-wrapper list disabled' : 'button-wrapper lift';
  return (
    <div className="table-wrapper">
      <div className="container tight">
        <div className="scroll-horizontal-rotated ui lift">
          <div className="cancel-rotate">
            <table className="ui sortable unstackable selectable compact table ember-view">
              <thead>
                <tr>{renderedHeaders}</tr>
              </thead>
              <tbody>
                {renderedRows}
              </tbody>
            </table>
          </div>
        </div>
        <div className="pagination">
          <div className={backButtonClasses}>
            <button
              onClick={(e) => {
                currentPage !== 1 ? updatePage(e, 'Beginning') : null;
              }}
              className="datatable__button"
            >
              &lt;&lt;
            </button>
            <span className="separator" />
            <button
              onClick={(e) => {
                currentPage !== 1 ? updatePage(e, 'Backward') : null;
              }}
              className="datatable__button"
            >
               &lt;
            </button>
          </div>

          <div className="page-counter">
            {currentPage}
            <span className="separator" />
            {numOfPages}
          </div>

          <div className={forwardButtonClasses}>
            <button
              onClick={(e) => {
                currentPage !== numOfPages ? updatePage(e, 'Forward') : null;
              }}
              className="datatable__button"
            >
              &gt;
            </button>
            <span className="separator" />
            <button
              onClick={(e) => {
                currentPage !== numOfPages ? updatePage(e, 'End', numOfPages) : null;
              }}
              className="datatable__button"
            >
              &gt;&gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

DatasetTable.propTypes = {
  columnKeys: PropTypes.arrayOf(PropTypes.object),
  currentPage: PropTypes.number,
  metadata: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.objectOf(PropTypes.object),
  ]),
  queryYearColumn: PropTypes.string,
  rows: PropTypes.arrayOf(PropTypes.object),
  selectedYears: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  updatePage: PropTypes.func.isRequired,
};

DatasetTable.defaultProps = {
  columnKeys: [],
  currentPage: 1,
  metadata: [],
  queryYearColumn: '',
  rows: [],
  selectedYears: [],
};

export default DatasetTable;
