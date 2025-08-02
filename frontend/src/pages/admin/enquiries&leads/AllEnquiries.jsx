import React, { useEffect, useState } from "react";
import { GetAllContactUs } from "../../../Services/admin/Admin"; // adjust path if different
import { Link } from "react-router-dom";
import Datatable from "react-data-table-component";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
export default function AllEnquiries() {
  const [contacts, setContacts] = useState([]);
  const token = localStorage.getItem("token");
  const [searchText, setSearchText] = useState("");

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const fetchAllContactUs = async (page, limit) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await GetAllContactUs(token, page, limit);
      if (res?.data && res?.pagination) {
        setContacts(res.data);
        setTotalRows(res.pagination.total_records);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching vendors:", err);
      Swal.fire("Error", "Could not load vendor list", "error");
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const filteredData = contacts.filter((item) =>
      item.name?.toLowerCase().includes(searchText.toLowerCase())
    );

    const formattedData = filteredData.map((item, index) => ({
      "S.No": (currentPage - 1) * perPage + index + 1,
      Name: item.name || "",
      Email: item.email || "",
      Phone: item.phone || "",
      Subject: item.subject || "",
      Message: item.message || "",
      Date: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("en-GB")
        : "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Enquiries");

    XLSX.writeFile(workbook, "Current-Enquiries.xlsx");
  };

  const filteredContacts = contacts.filter((Enquiries) =>
    Enquiries.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    fetchAllContactUs(currentPage, perPage);
  }, [currentPage, perPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => (currentPage - 1) * perPage + index + 1,
      width: "70px",
    },
    {
      name: "Name",
      selector: (row) => row?.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row?.email,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => row?.phone,
      sortable: true,
    },
    {
      name: "Subject",
      selector: (row) => row?.subject,
      sortable: true,
    },
    {
      name: "Message",
      selector: (row) => row?.message,
      sortable: true,
      // grow: 2,
    },
    {
      name: "Date",
      selector: (row) => {
        if (!row?.createdAt) return "-";
        const d = new Date(row.createdAt);
        return `${String(d.getDate()).padStart(2, "0")}-${String(
          d.getMonth() + 1
        ).padStart(2, "0")}-${d.getFullYear()}`;
      },
      sortable: true,
    },
  ];

  return (
    <div className="page-content">
      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <div className="add-page-heading-div">
            <Link to="/admin/dashboard">
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </Link>
            <h2 className="add-page-heading">All Enquiries </h2>
          </div>
        </div>
        <div className="col-md-6 text-end">
          <button className="btn btn-success me-2" onClick={exportToExcel}>
            <i className="fa-solid fa-file-excel me-1"></i>
            Download Excel
          </button>
        </div>
      </div>

      <div className="card">
        <div
          className="d-flex align-items-center border rounded px-2 "
          style={{ maxWidth: "250px" }}
        >
          <i className="ri-search-line me-2 mx-5 text-muted" />
          <input
            type="text"
            className="form-control border-0 shadow-none"
            placeholder="Search by name..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          {searchText && (
            <button
              className="btn btn-sm btn-light border-0"
              onClick={() => setSearchText("")}
            >
              <i className="ri-close-line" />
            </button>
          )}
        </div>
        <div className="row">
          <div className="col-md-12">
            <Datatable
              columns={columns}
              data={filteredContacts}
              progressPending={loading}
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              paginationPerPage={perPage}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
