import React, { useState, useEffect } from "react";
import styles from "../Styles/ViewCustomers.module.css"; // Import the CSS module

const ViewCustomers = (props) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const { setProgress } = props;

  useEffect(() => {
    setProgress(20);

    // Dummy data for customers
    const dummyCustomers = [
      { _id: "1", name: "Alice", email: "alice@example.com", age: 25, visits: 10, totalSpend: 500, joinDate: "2024-01-01" },
      { _id: "2", name: "Bob", email: "bob@example.com", age: 30, visits: 5, totalSpend: 200, joinDate: "2024-02-01" },
      { _id: "3", name: "Charlie", email: "charlie@example.com", age: 28, visits: 8, totalSpend: 300, joinDate: "2024-03-01" },
      { _id: "4", name: "David", email: "david@example.com", age: 35, visits: 15, totalSpend: 800, joinDate: "2024-04-01" },
      { _id: "5", name: "Eve", email: "eve@example.com", age: 22, visits: 12, totalSpend: 600, joinDate: "2024-05-01" },
      { _id: "6", name: "Frank", email: "frank@example.com", age: 40, visits: 20, totalSpend: 1000, joinDate: "2024-06-01" },
      { _id: "7", name: "Grace", email: "grace@example.com", age: 27, visits: 6, totalSpend: 350, joinDate: "2024-07-01" },
      { _id: "8", name: "Hannah", email: "hannah@example.com", age: 29, visits: 9, totalSpend: 450, joinDate: "2024-08-01" },
    ];

    setCustomers(dummyCustomers);
    setLoading(false);
    setProgress(100);
  }, [setProgress]);

  const handleDeleteCustomer = (customerId) => {
    setCustomers(customers.filter((customer) => customer._id !== customerId));
    setMessage("Customer deleted successfully!");
    setMessageType("success");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Customer List</h2>

      {message && (
        <div
          className={`${styles.alert} ${
            messageType === "success" ? styles["alert-success"] : styles["alert-danger"]
          }`}
        >
          {message}
        </div>
      )}

      {loading ? (
        <div className={styles["loading-text"]}>
          <p>Loading...</p>
        </div>
      ) : customers.length === 0 ? (
        <div className={`${styles.alert} ${styles["alert-info"]}`} role="alert">
          No customers found.
        </div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Visits</th>
              <th>Total Spend</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.age || "N/A"}</td>
                <td>{customer.visits || 0}</td>
                <td>{customer.totalSpend || 0}</td>
                <td>{new Date(customer.joinDate).toLocaleDateString()}</td>
                <td>
                  <i
                    className="fas fa-trash"
                    style={{ cursor: "pointer", color: "red" }}
                    onClick={() => handleDeleteCustomer(customer._id)}
                    title="Delete Customer"
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewCustomers;
