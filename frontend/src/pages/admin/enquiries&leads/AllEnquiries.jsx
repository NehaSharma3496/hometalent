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
  const [allContacts, setAllContacts] = useState([]);

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

  const fetchGlobalContactUs = async () => {
    const token = localStorage.getItem("token");
    let allData = [];
    let page = 1;
    const limit = 100;
    let totalPages = 1;

    while (page <= totalPages) {
      const res = await GetAllContactUs(token, page, limit);
      if (res?.data && res?.pagination?.total_records) {
        allData = [...allData, ...res.data];
        totalPages = Math.ceil(res.pagination.total_records / limit);
      } else {
        break;
      }
      page++;
    }

    setAllContacts(allData);
  };

  const exportToExcel = async () => {
    try {
      const token = localStorage.getItem("token");

      let allContacts = [];
      let page = 1;
      const limit = 100;
      let totalPages = 1;

      while (page <= totalPages) {
        const res = await GetAllContactUs(token, page, limit);

        if (res?.data && res?.pagination?.total_records) {
          allContacts = [...allContacts, ...res.data];
          totalPages = Math.ceil(res.pagination.total_records / limit);
        } else {
          throw new Error("Invalid response format");
        }

        page++;
      }

      if (!allContacts.length) {
        Swal.fire("No Data", "There are no enquiries to export", "info");
        return;
      }

      const filteredData = allContacts.filter((item) =>
        item.name?.toLowerCase().includes(searchText.toLowerCase())
      );

      if (!filteredData.length) {
        Swal.fire("No Matches", "No enquiries match your search", "info");
        return;
      }

      const formattedData = filteredData.map((item, index) => ({
        "S.No": index + 1,
        Name: item.name || "",
        Email: item.email || "",
        Phone: item.phone || "",
        Subject: item.subject || "",
        Message: item.message || "",
        Date: item.createdAt
          ? new Date(item.createdAt).toLocaleDateString("en-GB")
          : "-",
      }));

      const XLSX = await import("xlsx");
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Enquiries");

      XLSX.writeFile(workbook, "All-Enquiries.xlsx");

      Swal.fire("Success", "Enquiries exported successfully", "success");
    } catch (error) {
      console.error("Export error:", error);
      Swal.fire("Error", "Failed to export enquiries", "error");
    }
  };

  const filteredContacts = searchText
    ? allContacts.filter((entry) =>
        entry.name?.toLowerCase().includes(searchText.toLowerCase())
      )
    : contacts;

  useEffect(() => {
    fetchAllContactUs(currentPage, perPage);
    fetchGlobalContactUs();
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
