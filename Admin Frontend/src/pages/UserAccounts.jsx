import React, { useState, useEffect } from "react";
import "../style/userAccounts.css";

const dummyUsers = [
  {
    id: 1,
    name: "Diana Prince",
    email: "diana.p@example.com",
    avatar: "https://i.pravatar.cc/40?img=1",
    signUpDate: "2024-02-10",
    lastActivity: "2024-07-28",
    status: "Flagged",
    consultations: 1,
  },
  {
    id: 2,
    name: "Grace Hall",
    email: "grace.h@example.com",
    avatar: "https://i.pravatar.cc/40?img=2",
    signUpDate: "2024-01-05",
    lastActivity: "2024-07-28",
    status: "Active",
    consultations: 15,
  },
  {
    id: 3,
    name: "Eve Adams",
    email: "eve.a@example.com",
    avatar: "https://i.pravatar.cc/40?img=3",
    signUpDate: "2023-08-01",
    lastActivity: "2024-07-28",
    status: "Active",
    consultations: 8,
  },
];

// generate extra dummy data
for (let i = 4; i <= 30; i++) {
  dummyUsers.push({
    id: i,
    name: `User ${i}`,
    email: `user${i}@example.com`,
    avatar: `https://i.pravatar.cc/40?img=${i}`,
    signUpDate: "2023-06-15",
    lastActivity: "2024-07-20",
    status: i % 5 === 0 ? "Flagged" : i % 2 === 0 ? "Active" : "Inactive",
    consultations: Math.floor(Math.random() * 20),
  });
}

const ITEMS_PER_PAGE = 7;

const UserAccounts = () => {
  const [users, setUsers] = useState(dummyUsers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("signUpDate");
  const [currentPage, setCurrentPage] = useState(1);

  // Bulk Actions
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showBulkMenu, setShowBulkMenu] = useState(false);

  // Per-user menu
  const [openMenuUser, setOpenMenuUser] = useState(null);

  const toggleSelectUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (checked, usersOnPage) => {
    if (checked) {
      setSelectedUsers((prev) => [
        ...new Set([...prev, ...usersOnPage.map((u) => u.id)]),
      ]);
    } else {
      setSelectedUsers((prev) =>
        prev.filter((id) => !usersOnPage.map((u) => u.id).includes(id))
      );
    }
  };

  const handleBulkAction = (action) => {
    let updatedUsers = [...users];
    if (action === "activate") {
      updatedUsers = updatedUsers.map((u) =>
        selectedUsers.includes(u.id) ? { ...u, status: "Active" } : u
      );
    } else if (action === "deactivate") {
      updatedUsers = updatedUsers.map((u) =>
        selectedUsers.includes(u.id) ? { ...u, status: "Inactive" } : u
      );
    } else if (action === "flag") {
      updatedUsers = updatedUsers.map((u) =>
        selectedUsers.includes(u.id) ? { ...u, status: "Flagged" } : u
      );
    } else if (action === "delete") {
      updatedUsers = updatedUsers.filter((u) => !selectedUsers.includes(u.id));
    }
    setUsers(updatedUsers);
    setSelectedUsers([]);
    setShowBulkMenu(false);
  };

  const handleUserAction = (userId, action) => {
    let updatedUsers = [...users];
    if (action === "activate") {
      updatedUsers = updatedUsers.map((u) =>
        u.id === userId ? { ...u, status: "Active" } : u
      );
    } else if (action === "deactivate") {
      updatedUsers = updatedUsers.map((u) =>
        u.id === userId ? { ...u, status: "Inactive" } : u
      );
    } else if (action === "flag") {
      updatedUsers = updatedUsers.map((u) =>
        u.id === userId ? { ...u, status: "Flagged" } : u
      );
    } else if (action === "delete") {
      updatedUsers = updatedUsers.filter((u) => u.id !== userId);
    } else if (action === "view") {
      alert(`Viewing profile of user ${userId}`);
    }
    setUsers(updatedUsers);
    setOpenMenuUser(null);
  };

  // Filter & Search
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ? true : user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sorting
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === "signUpDate") {
      return new Date(b.signUpDate) - new Date(a.signUpDate);
    } else if (sortBy === "lastActivity") {
      return new Date(b.lastActivity) - new Date(a.lastActivity);
    } else if (sortBy === "consultations") {
      return b.consultations - a.consultations;
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Stats
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Active").length;
  const flaggedUsers = users.filter((u) => u.status === "Flagged").length;
  const newUsers = 120; // static for demo

  // close menu on outside click
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuUser(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="user-accounts">
      <h2>User Accounts</h2>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="card">
          <h3>{totalUsers}</h3>
          <p>Total Users</p>
        </div>
        <div className="card">
          <h3>{activeUsers}</h3>
          <p>Active Users</p>
        </div>
        <div className="card">
          <h3>{flaggedUsers}</h3>
          <p>Flagged Accounts</p>
        </div>
        <div className="card">
          <h3>{newUsers}</h3>
          <p>New Users (This Month)</p>
        </div>
      </div>

      {/* Filters */}
      <div className="actions-bar">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="status-filters">
          {["All", "Active", "Inactive", "Flagged"].map((status) => (
            <button
              key={status}
              className={statusFilter === status ? "active" : ""}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
            >
              {status}
            </button>
          ))}
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="signUpDate">Sort by: Sign-up Date</option>
          <option value="lastActivity">Sort by: Last Activity</option>
          <option value="consultations">Sort by: Consultations</option>
        </select>
        <div className="bulk-action-wrapper">
          <button
            className="bulk-btn"
            onClick={() => setShowBulkMenu((prev) => !prev)}
            disabled={selectedUsers.length === 0}
          >
            Bulk Actions
          </button>
          {showBulkMenu && (
            <div className="bulk-menu">
              <button onClick={() => handleBulkAction("activate")}>
                Activate
              </button>
              <button onClick={() => handleBulkAction("deactivate")}>
                Deactivate
              </button>
              <button onClick={() => handleBulkAction("flag")}>Flag</button>
              <button onClick={() => handleBulkAction("delete")}>Delete</button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <table className="users-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={(e) =>
                  toggleSelectAll(e.target.checked, paginatedUsers)
                }
                checked={
                  paginatedUsers.length > 0 &&
                  paginatedUsers.every((u) => selectedUsers.includes(u.id))
                }
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Sign-up Date</th>
            <th>Last Activity</th>
            <th>Status</th>
            <th>Consultations</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user) => (
            <tr key={user.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => toggleSelectUser(user.id)}
                />
              </td>
              <td>
                <div className="user-info">
                  <img src={user.avatar} alt={user.name} />
                  <span>{user.name}</span>
                </div>
              </td>
              <td>{user.email}</td>
              <td>{user.signUpDate}</td>
              <td>{user.lastActivity}</td>
              <td>
                <span className={`status ${user.status.toLowerCase()}`}>
                  {user.status}
                </span>
              </td>
              <td>{user.consultations}</td>
              <td className="action-cell">
                <button
                  className="menu-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuUser(openMenuUser === user.id ? null : user.id);
                  }}
                >
                  ⋮
                </button>
                {openMenuUser === user.id && (
                  <div className="user-action-menu">
                    <button onClick={() => handleUserAction(user.id, "view")}>
                      View
                    </button>
                    <button
                      onClick={() => handleUserAction(user.id, "activate")}
                    >
                      Activate
                    </button>
                    <button
                      onClick={() => handleUserAction(user.id, "deactivate")}
                    >
                      Deactivate
                    </button>
                    <button onClick={() => handleUserAction(user.id, "flag")}>
                      Flag
                    </button>
                    <button onClick={() => handleUserAction(user.id, "delete")}>
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserAccounts;
