import React, { useState } from "react";
import { FaUsers, FaCheckCircle, FaRupeeSign } from "react-icons/fa";
import "../style/home.css";

const Home = () => {
  // Dummy lawyers data
  const lawyersData = [
    { id: 1, name: "Ravi Sharma", specialization: "Corporate Law", cases: 120 },
    { id: 2, name: "Anita Desai", specialization: "Criminal Law", cases: 95 },
    { id: 3, name: "Vikram Mehta", specialization: "Family Law", cases: 80 },
    { id: 4, name: "Priya Kapoor", specialization: "Civil Law", cases: 70 },
    { id: 5, name: "Rahul Nair", specialization: "Taxation", cases: 65 },
    { id: 6, name: "Sneha Verma", specialization: "Property Law", cases: 60 },
    { id: 7, name: "Arjun Gupta", specialization: "Labour Law", cases: 55 },
    {
      id: 8,
      name: "Kavita Joshi",
      specialization: "Intellectual Property",
      cases: 50,
    },
    { id: 9, name: "Suresh Iyer", specialization: "Cyber Law", cases: 45 },
    {
      id: 10,
      name: "Meena Reddy",
      specialization: "Environmental Law",
      cases: 40,
    },
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const lawyersPerPage = 5;

  const indexOfLastLawyer = currentPage * lawyersPerPage;
  const indexOfFirstLawyer = indexOfLastLawyer - lawyersPerPage;
  const currentLawyers = lawyersData.slice(
    indexOfFirstLawyer,
    indexOfLastLawyer
  );

  const totalPages = Math.ceil(lawyersData.length / lawyersPerPage);

  return (
    <div className="home">
      {/* Top Summary Cards */}
      <div className="cards">
        <div className="card">
          <FaUsers className="card-icon" />
          <h3>5,230</h3>
          <p>Total Users</p>
          <small>Active users this month</small>
        </div>
        <div className="card">
          <FaCheckCircle className="card-icon" />
          <h3>125</h3>
          <p>Pending Verifications</p>
          <small>Lawyer accounts awaiting review</small>
        </div>
        <div className="card">
          <FaRupeeSign className="card-icon" />
          <h3>₹ 4,50,000</h3>
          <p>Revenue</p>
          <small>Total earnings this quarter</small>
        </div>
      </div>

      {/* Top Lawyers Table */}
      <div className="lawyers-section">
        <h2>Top Lawyers</h2>
        <table className="lawyers-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Specialization</th>
              <th>Cases Handled</th>
            </tr>
          </thead>
          <tbody>
            {currentLawyers.map((lawyer) => (
              <tr key={lawyer.id}>
                <td>{lawyer.id}</td>
                <td>{lawyer.name}</td>
                <td>{lawyer.specialization}</td>
                <td>{lawyer.cases}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
