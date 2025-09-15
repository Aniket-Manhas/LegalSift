import React, { useState } from "react";
import "../styles/contactlawyer.css";

// Sample data
const lawyers = [
  {
    id: 1,
    name: "Adv. Priya Sharma",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    experience: 8,
    fee: 1200,
    specialization: "Criminal Law",
    barCouncilId: "JK2021A123",
    association: "Jammu Bar Association",
    email: "priya.sharma@email.com",
    phone: "+91 9876543210",
    address: "Jammu, India",
    about:
      "Specialist in criminal law with 8+ years of experience. Known for high success rate and client satisfaction.",
  },
  {
    id: 2,
    name: "Adv. Rahul Verma",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    experience: 5,
    fee: 900,
    specialization: "Civil Law",
    barCouncilId: "JK2019B456",
    association: "Jammu Bar Association",
    email: "rahul.verma@email.com",
    phone: "+91 9123456780",
    address: "Jammu, India",
    about:
      "Expert in civil and property disputes. Provides practical solutions and transparent advice.",
  },
  {
    id: 3,
    name: "Adv. Sneha Gupta",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    experience: 10,
    fee: 1500,
    specialization: "Family Law",
    barCouncilId: "JK2015C789",
    association: "Jammu Bar Association",
    email: "sneha.gupta@email.com",
    phone: "+91 9988776655",
    address: "Jammu, India",
    about:
      "Family law specialist with a decade of experience. Compassionate and result-oriented.",
  },
];

export default function ContactLawyer() {
  const [selectedLawyer, setSelectedLawyer] = useState(null);

  return (
    <div className="contactlawyer-container">
      <h2 className="contactlawyer-title">Find & Contact a Lawyer</h2>

      <div className="lawyer-list-section">
        {/* Lawyer List */}
        <div className="lawyer-list">
          {lawyers.map((lawyer) => (
            <div
              key={lawyer.id}
              className={`lawyer-card${
                selectedLawyer && selectedLawyer.id === lawyer.id ? " selected" : ""
              }`}
              onClick={() => setSelectedLawyer(lawyer)}
              tabIndex={0}
              role="button"
              aria-pressed={selectedLawyer && selectedLawyer.id === lawyer.id}
            >
              <img
                src={lawyer.image}
                alt={lawyer.name}
                className="lawyer-img"
              />
              <div className="lawyer-info">
                <h3>{lawyer.name}</h3>
                <p><b>Experience:</b> {lawyer.experience} yrs</p>
                <p><b>Fee:</b> ₹{lawyer.fee}</p>
                <p><b>Specialization:</b> {lawyer.specialization}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lawyer Details */}
        <div className="lawyer-details-section">
          {selectedLawyer ? (
            <div className="lawyer-details-card">
              <img
                src={selectedLawyer.image}
                alt={selectedLawyer.name}
                className="lawyer-details-img"
              />
              <h3>{selectedLawyer.name}</h3>
              <p><b>Experience:</b> {selectedLawyer.experience} years</p>
              <p><b>Fee:</b> ₹{selectedLawyer.fee}</p>
              <p><b>Specialization:</b> {selectedLawyer.specialization}</p>
              <p><b>Bar Council ID:</b> {selectedLawyer.barCouncilId}</p>
              <p><b>Association:</b> {selectedLawyer.association}</p>
              <p>
                <b>Email:</b>{" "}
                <a href={`mailto:${selectedLawyer.email}`}>{selectedLawyer.email}</a>
              </p>
              <p><b>Address:</b> {selectedLawyer.address}</p>
              <p><b>About:</b> {selectedLawyer.about}</p>
            </div>
          ) : (
            <div className="lawyer-details-placeholder">
              <p>Select a lawyer to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
