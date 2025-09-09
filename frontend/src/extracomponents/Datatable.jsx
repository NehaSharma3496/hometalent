import React, { useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";

const Datatable = ({ columns, data, title = "Data Table" }) => {
  const [filterText, setFilterText] = useState("");

  // Filtered data based on search
  const filteredData = useMemo(() => {
    return data.filter(item =>
      columns.some(col => {
        const value = item[col.selector];
        return value
          ? value.toString().toLowerCase().includes(filterText.toLowerCase())
          : false;
      })
    );
  }, [filterText, data, columns]);

  // Export filtered data to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${title}.xlsx`);
  };

  return (
    <div>
      {/* Search and Export */}
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <input
          type="text"
          placeholder="Search..."
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
          className="form-control w-25"
        />
        <button className="btn btn-success" onClick={exportToExcel}>
          Export to Excel
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        title={title}
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        pointerOnHover
        responsive
      />
    </div>
  );
};

export default Datatable;
