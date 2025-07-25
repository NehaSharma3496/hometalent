import React, { useEffect, useState } from "react";
import { GetAllContactUs } from "../../../Services/admin/Admin"; // adjust path if different
import { Link } from "react-router-dom";
import Datatable from "../../../extracomponents/Datatable";
import * as XLSX from "xlsx";

export default function AllEnquiries() {
  const [contacts, setContacts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const token = localStorage.getItem("token");
  const [searchText, setSearchText] = useState("");

  const fetchAllContactUs = async () => {
    try {
      const response = await GetAllContactUs(token);
      setContacts(response?.data || []);
      setPagination(response?.pagination || null);
    } catch (error) {
      console.error("Error fetching contact-us:", error);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(contacts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");

    XLSX.writeFile(workbook, "Enquiries-list.xlsx");
  };

  const filteredContacts = contacts.filter((Enquiries) =>
    Enquiries.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    fetchAllContactUs();
  }, []);

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      sortable: false,
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
      name: "Created At",
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
            <Datatable columns={columns} data={filteredContacts} pagination />
          </div>
        </div>
      </div>
    </div>
  );
}
