import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Link,useNavigate } from "react-router-dom";
import Datatable from "react-data-table-component";
import { GetReport } from "../../../Services/webService/Web";
import { Modal, Button } from "react-bootstrap";

export default function AllReport() {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [fullText, setFullText] = useState("");
  const navigate = useNavigate();

  const handleReadMore = (text) => {
    setFullText(text);
    setShowModal(true);
  };

  const fetchReport = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await GetReport(token, 1, 100);
      setReport(res?.data || []);
    } catch (err) {
      Swal.fire("Error", "Failed to load reviews", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      width: "60px",
    },
    {
      name: "Name",
      selector: (row) => row?.name || "N/A",
      width: "150px",

    },
    {
      name: "Phone",
      selector: (row) => row?.phone || "N/A",
      width: "150px",

    },
    {
      name: "Reason",
      selector: (row) => row?.reason || "N/A",
      width: "300px",
    },
    {
      name: "Vendor Name",
      selector: (row) => row?.User?.owner_name || "N/A",
      width: "300px",
    },
    {
      name: "Date",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="page-content">
      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <div className="add-page-heading-div">
             <button
              className="btn btn-link p-0"
              onClick={() => navigate(-1)}  // 🔹 पिछली history में वापस जाएगा
            >
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </button>
            <h2 className="add-page-heading">All Report</h2>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <Datatable
            columns={columns}
            data={report}
            progressPending={loading}
            pagination
          />
        </div>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Full Message</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{
            maxHeight: "400px",
            overflowY: "auto",
            wordWrap: "break-word",
            whiteSpace: "pre-wrap"
          }}
          >
            {fullText}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
