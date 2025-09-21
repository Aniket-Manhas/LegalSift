import React, { useState } from "react";
import "../style/lawyer.css";

const dummyLawyers = [
  {
    id: 1,
    name: "Arjun Mehta",
    email: "arjun.mehta@example.com",
    specialization: "Corporate Law",
    license: "LIC123456",
    barCouncil: "Bar Council of Delhi",
    verified: false,
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    specialization: "Criminal Law",
    license: "LIC789012",
    barCouncil: "Bar Council of Maharashtra",
    verified: true,
  },
  {
    id: 3,
    name: "Rohit Verma",
    email: "rohit.verma@example.com",
    specialization: "Family Law",
    license: "LIC345678",
    barCouncil: "Bar Council of Rajasthan",
    verified: false,
  },
  {
    id: 4,
    name: "Neha Kapoor",
    email: "neha.kapoor@example.com",
    specialization: "Intellectual Property",
    license: "LIC901234",
    barCouncil: "Bar Council of Karnataka",
    verified: true,
  },
  {
    id: 5,
    name: "Amit Desai",
    email: "amit.desai@example.com",
    specialization: "Tax Law",
    license: "LIC567890",
    barCouncil: "Bar Council of Gujarat",
    verified: false,
  },
  {
    id: 6,
    name: "Sneha Reddy",
    email: "sneha.reddy@example.com",
    specialization: "Cyber Law",
    license: "LIC112233",
    barCouncil: "Bar Council of Telangana",
    verified: false,
  },
  {
    id: 7,
    name: "Vikram Malhotra",
    email: "vikram.malhotra@example.com",
    specialization: "Civil Litigation",
    license: "LIC445566",
    barCouncil: "Bar Council of Punjab & Haryana",
    verified: true,
  },
  {
    id: 8,
    name: "Ritu Agarwal",
    email: "ritu.agarwal@example.com",
    specialization: "Environmental Law",
    license: "LIC778899",
    barCouncil: "Bar Council of West Bengal",
    verified: false,
  },
  {
    id: 9,
    name: "Siddharth Nair",
    email: "siddharth.nair@example.com",
    specialization: "International Law",
    license: "LIC223344",
    barCouncil: "Bar Council of Kerala",
    verified: true,
  },
  {
    id: 10,
    name: "Meera Joshi",
    email: "meera.joshi@example.com",
    specialization: "Labour & Employment Law",
    license: "LIC556677",
    barCouncil: "Bar Council of Madhya Pradesh",
    verified: false,
  },
];

const ITEMS_PER_PAGE = 5;

const LawyerManagement = () => {
  const [lawyers, setLawyers] = useState(dummyLawyers);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending"); // "pending" or "verified"
  const [specializationFilter, setSpecializationFilter] = useState("");

  // Filtered lawyers
  const filteredLawyers = lawyers.filter((lawyer) => {
    const matchesSearch =
      lawyer.name.toLowerCase().includes(search.toLowerCase()) ||
      lawyer.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "pending" ? !lawyer.verified : lawyer.verified;
    const matchesSpecialization = specializationFilter
      ? lawyer.specialization === specializationFilter
      : true;
    return matchesSearch && matchesStatus && matchesSpecialization;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredLawyers.length / ITEMS_PER_PAGE);
  const paginatedLawyers = filteredLawyers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle actions
  const handleVerify = (id) => {
    setLawyers((prev) =>
      prev.map((lawyer) =>
        lawyer.id === id ? { ...lawyer, verified: true } : lawyer
      )
    );
    setSelectedLawyer((prev) => ({ ...prev, verified: true }));
  };

  const handleUnverify = (id) => {
    setLawyers((prev) =>
      prev.map((lawyer) =>
        lawyer.id === id ? { ...lawyer, verified: false } : lawyer
      )
    );
    setSelectedLawyer((prev) => ({ ...prev, verified: false }));
  };

  const handleReject = (id) => {
    setLawyers((prev) => prev.filter((lawyer) => lawyer.id !== id));
    setSelectedLawyer(null);
  };

  return (
    <div className="lawyer-management">
      <h2>Lawyer Management</h2>

      {/* Filter Bar */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={specializationFilter}
          onChange={(e) => setSpecializationFilter(e.target.value)}
        >
          <option value="">All Specializations</option>
          {[...new Set(lawyers.map((l) => l.specialization))].map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>
      </div>

      {/* Toggle Bar */}
      <div className="toggle-bar">
        <button
          className={statusFilter === "pending" ? "active" : ""}
          onClick={() => {
            setStatusFilter("pending");
            setCurrentPage(1);
          }}
        >
          Verification Requests
        </button>
        <button
          className={statusFilter === "verified" ? "active" : ""}
          onClick={() => {
            setStatusFilter("verified");
            setCurrentPage(1);
          }}
        >
          Verified Lawyers
        </button>
      </div>

      {/* Table */}
      <table className="lawyer-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Specialization</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {paginatedLawyers.length > 0 ? (
            paginatedLawyers.map((lawyer) => (
              <tr
                key={lawyer.id}
                className="lawyer-row"
                onClick={() => setSelectedLawyer(lawyer)}
              >
                <td>{lawyer.name}</td>
                <td>{lawyer.email}</td>
                <td>{lawyer.specialization}</td>
                <td>
                  {lawyer.verified ? (
                    <span className="verified">Verified</span>
                  ) : (
                    <span className="pending">Pending</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                No lawyers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {filteredLawyers.length > 0 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Popup Modal */}
      {selectedLawyer && (
        <div className="modal-overlay" onClick={() => setSelectedLawyer(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedLawyer.name}</h3>
            <p>
              <strong>Email:</strong> {selectedLawyer.email}
            </p>
            <p>
              <strong>Specialization:</strong> {selectedLawyer.specialization}
            </p>
            <p>
              <strong>License:</strong> {selectedLawyer.license}
            </p>
            <p>
              <strong>Bar Council:</strong> {selectedLawyer.barCouncil}
            </p>

            <div className="modal-actions">
              {!selectedLawyer.verified && (
                <button
                  className="verify-btn"
                  onClick={() => handleVerify(selectedLawyer.id)}
                >
                  Verify
                </button>
              )}
              {selectedLawyer.verified && (
                <button
                  className="unverify-btn"
                  onClick={() => handleUnverify(selectedLawyer.id)}
                >
                  Unverify
                </button>
              )}
              <button
                className="reject-btn"
                onClick={() => handleReject(selectedLawyer.id)}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LawyerManagement;
