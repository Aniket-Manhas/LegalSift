import React, { useState, useRef } from "react";
import "../style/paymentsRevenue.css";

// Generate 50 dummy transactions
const generateDummyTransactions = () => {
  const statuses = ["Success", "Pending", "Failed"];
  const users = [
    "Alice",
    "Bob",
    "Charlie",
    "Diana",
    "Eve",
    "Frank",
    "Grace",
    "Hank",
    "Ivy",
    "Jack",
  ];
  const lawyers = [
    "Rajesh Kumar",
    "Priya Sharma",
    "Sanjay Singh",
    "Neha Patel",
    "Vikram Reddy",
  ];

  const transactions = [];
  for (let i = 1; i <= 50; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomLawyer = lawyers[Math.floor(Math.random() * lawyers.length)];
    const randomAmount = Math.floor(Math.random() * 500) + 50;
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomDate = new Date(2024, 6, 1 + (i % 30))
      .toISOString()
      .split("T")[0];

    transactions.push({
      id: i,
      user: `${randomUser} ${String.fromCharCode(65 + (i % 26))}`,
      lawyer: randomLawyer,
      amount: randomAmount,
      status: randomStatus,
      date: randomDate,
    });
  }
  return transactions;
};

const PaymentsRevenue = () => {
  const allTransactions = generateDummyTransactions();
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;
  const tableRef = useRef();

  const totalRevenue = 15320;
  const commission = 2100.5;
  const pendingPayouts = 850;

  // Pagination logic
  const indexOfLast = currentPage * transactionsPerPage;
  const indexOfFirst = indexOfLast - transactionsPerPage;
  const currentTransactions = allTransactions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(allTransactions.length / transactionsPerPage);

  const paginate = (pageNum) => setCurrentPage(pageNum);
  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // Export CSV (all data)
  const exportCSV = () => {
    const headers = ["User", "Lawyer", "Amount", "Status", "Date"];
    const rows = allTransactions.map((t) => [
      t.user,
      t.lawyer,
      `$${t.amount.toFixed(2)}`,
      t.status,
      `"${new Date(t.date).toLocaleDateString("en-US")}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export PDF (print)
  const exportPDF = () => {
    const printContents = tableRef.current.innerHTML;
    const win = window.open("", "", "width=900,height=700");
    win.document.write("<html><head><title>Transactions</title>");
    win.document.write(
      "<style>table{width:100%;border-collapse:collapse} th,td{border:1px solid #ddd;padding:8px;text-align:left;} th{background:#f2f2f2;}</style>"
    );
    win.document.write("</head><body>");
    win.document.write("<h2>Transactions Report</h2>");
    win.document.write(printContents);
    win.document.write("</body></html>");
    win.document.close();
    win.print();
  };

  return (
    <div className="payments-revenue">
      <h2>Payments and Revenue</h2>

      {/* Stats cards */}
      <div className="stats-cards">
        <div className="card">
          <p>Monthly Revenue Overview</p>
          <h3>${totalRevenue.toLocaleString()}</h3>
          <span className="info">Last 30 Days</span>
          <span className="trend positive">↑ 5.2% increase</span>
        </div>
        <div className="card">
          <p>Commission Earned</p>
          <h3>${commission.toLocaleString()}</h3>
          <span className="info">This Month</span>
          <span className="trend positive">↑ 7.8% increase</span>
        </div>
        <div className="card">
          <p>Pending Payouts</p>
          <h3 className="negative">${pendingPayouts.toLocaleString()}</h3>
          <span className="info">Unprocessed</span>
          <span className="trend negative">↓ 2.1% decrease</span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="transactions">
        <div className="table-header">
          <h3>Recent Transactions</h3>
          <div className="export-buttons">
            <button className="export-btn" onClick={exportCSV}>
              📄 Export CSV
            </button>
            <button className="export-btn" onClick={exportPDF}>
              📄 Export PDF
            </button>
          </div>
        </div>

        <div ref={tableRef}>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Lawyer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((t) => (
                <tr key={t.id}>
                  <td>{t.user}</td>
                  <td>{t.lawyer}</td>
                  <td>${t.amount.toFixed(2)}</td>
                  <td>
                    <span className={`status ${t.status.toLowerCase()}`}>
                      {t.status}
                    </span>
                  </td>
                  <td>{new Date(t.date).toLocaleDateString("en-US")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button onClick={prevPage} disabled={currentPage === 1}>
            ◀ Prev
          </button>
          {[...Array(totalPages).keys()].map((n) => (
            <button
              key={n + 1}
              onClick={() => paginate(n + 1)}
              className={currentPage === n + 1 ? "active" : ""}
            >
              {n + 1}
            </button>
          ))}
          <button onClick={nextPage} disabled={currentPage === totalPages}>
            Next ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentsRevenue;
