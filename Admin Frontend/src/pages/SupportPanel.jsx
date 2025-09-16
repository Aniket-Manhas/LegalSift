import React, { useState } from "react";
import "../style/supportPanel.css";

const dummyTickets = [
  {
    id: "#001",
    query: "Unable to log in after password reset.",
    priority: "High",
    status: "Open",
    assigned: "Rajesh K.",
    updated: "2 hours ago",
  },
  {
    id: "#002",
    query: "Payment gateway not accepting new card details.",
    priority: "High",
    status: "In Progress",
    assigned: "Priya S.",
    updated: "1 day ago",
  },
  {
    id: "#003",
    query: "Consultation request with lawyer X is missing.",
    priority: "Medium",
    status: "Open",
    assigned: "Sunita G.",
    updated: "4 hours ago",
  },
  {
    id: "#004",
    query: "Profile verification documents rejected, no reason provided.",
    priority: "Medium",
    status: "In Progress",
    assigned: "Vikram P.",
    updated: "2 days ago",
  },
  {
    id: "#005",
    query: "General inquiry about platform features.",
    priority: "Low",
    status: "Resolved",
    assigned: "Aditi R.",
    updated: "3 days ago",
  },
  {
    id: "#006",
    query: "Received duplicate notification for same event.",
    priority: "Low",
    status: "Open",
    assigned: "Rajesh K.",
    updated: "6 hours ago",
  },
  {
    id: "#007",
    query: "Feedback on AI assistant response quality.",
    priority: "Medium",
    status: "In Progress",
    assigned: "Priya S.",
    updated: "1 day ago",
  },
];

const SupportPanel = () => {
  const [tickets, setTickets] = useState(dummyTickets);

  const resolveTicket = (id) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Resolved" } : t))
    );
  };

  return (
    <div className="support-panel">
      <h2>Support Panel</h2>
      <p className="subtitle">
        Manage and resolve user & lawyer support tickets efficiently.
      </p>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="card">
          <h3>87</h3>
          <p>Total Open Tickets</p>
          <span className="trend positive">↑ 5% from last month</span>
        </div>
        <div className="card">
          <h3>12</h3>
          <p>High Priority</p>
          <span className="trend negative">Urgent attention required</span>
        </div>
        <div className="card">
          <h3>5</h3>
          <p>Assigned to Me</p>
          <span className="trend neutral">Pending resolution</span>
        </div>
        <div className="card">
          <h3>23</h3>
          <p>Resolved Today</p>
          <span className="trend positive">Successfully closed</span>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="tickets">
        <div className="table-header">
          <h3>Support Tickets</h3>
          <div className="actions">
            <button className="export">Export</button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User Query</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Last Updated</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.query}</td>
                <td>
                  <span className={`priority ${t.priority.toLowerCase()}`}>
                    {t.priority}
                  </span>
                </td>
                <td>
                  <span
                    className={`status ${t.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {t.status}
                  </span>
                </td>
                <td>{t.assigned}</td>
                <td>{t.updated}</td>
                <td>
                  {t.status !== "Resolved" ? (
                    <button
                      className="resolve-btn"
                      onClick={() => resolveTicket(t.id)}
                    >
                      Resolve
                    </button>
                  ) : (
                    <span className="resolved-label">✔ Closed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="footer">Showing {tickets.length} of 87 tickets</div>
      </div>
    </div>
  );
};

export default SupportPanel;
