import React, { useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";

const Datatable = ({ columns, data, currentPage, setCurrentPage, perPage, setPerPage }) => {
  const [filterText, setFilterText] = useState("");

  // Filtered data based on search
  const filteredData = useMemo(() => {
    return data.filter((item) =>
      columns.some((col) => {
        let value =
          typeof col.selector === "function"
            ? col.selector(item)
            : item[col.selector];
        return value
          ? value.toString().toLowerCase().includes(filterText.toLowerCase())
          : false;
      })
    );
  }, [filterText, data, columns]);

  // Export filtered data to Excel
  const exportToExcel = () => {
    const exportData = filteredData.map((row) => {
      const newRow = {};
      columns.forEach((col) => {
        let value =
          typeof col.selector === "function"
            ? col.selector(row)
            : row[col.selector];
        newRow[col.name] = value;
      });
      return newRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `Sheet.xlsx`);
  };

  return (
    <div>
      {/* Search and Export */}
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <input
          type="text"
          placeholder="Search..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="form-control w-25"
        />
        <button className="btn btn-success" onClick={exportToExcel}>
          Export to Excel
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        responsive
        paginationPerPage={perPage}
        paginationDefaultPage={currentPage}
        paginationRowsPerPageOptions={[5, 10, 20, 50, 100]}
        onChangePage={(page) => setCurrentPage(page)}
        onChangeRowsPerPage={(newPerPage) => setPerPage(newPerPage)}
      />
    </div>
  );
};

export default Datatable;
