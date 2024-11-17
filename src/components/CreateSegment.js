import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const CreateSegment = (props) => {
  const [conditions, setConditions] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [segmentName, setSegmentName] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [segmentCreated, setSegmentCreated] = useState(false);
  const [messageTemplate, setMessageTemplate] = useState("");
  const [segmentId, setSegmentId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Dummy Customer Data
  const dummyCustomers = [
    { id: "1", name: "Alice", totalSpend: 500, visits: 10, lastVisitDate: 1 },
    { id: "2", name: "Bob", totalSpend: 200, visits: 5, lastVisitDate: 2 },
    { id: "3", name: "Charlie", totalSpend: 300, visits: 8, lastVisitDate: 3 },
    { id: "4", name: "David", totalSpend: 800, visits: 15, lastVisitDate: 0.5 },
    { id: "5", name: "Eve", totalSpend: 600, visits: 12, lastVisitDate: 1.5 },
    { id: "6", name: "Frank", totalSpend: 1000, visits: 20, lastVisitDate: 0.2 },
    { id: "7", name: "Grace", totalSpend: 350, visits: 6, lastVisitDate: 4 },
    { id: "8", name: "Hannah", totalSpend: 450, visits: 9, lastVisitDate: 2.5 },
    { id: "9", name: "Ivy", totalSpend: 700, visits: 11, lastVisitDate: 1 },
    { id: "10", name: "Jake", totalSpend: 150, visits: 3, lastVisitDate: 5 },
  ];

  const addCondition = () => {
    setConditions([...conditions, { field: "", operator: "", value: "", logic: "AND" }]);
  };

  const updateCondition = (index, key, value) => {
    const updatedConditions = [...conditions];
    updatedConditions[index][key] = value;
    setConditions(updatedConditions);
  };

  const deleteCondition = (index) => {
    const updatedConditions = conditions.filter((_, i) => i !== index);
    setConditions(updatedConditions);
  };

  const compare = (fieldValue, operator, value) => {
    switch (operator) {
      case ">":
        return fieldValue > value;
      case "<":
        return fieldValue < value;
      case ">=":
        return fieldValue >= value;
      case "<=":
        return fieldValue <= value;
      default:
        return true;
    }
  };

  const viewFilteredCustomers = () => {
    const filtered = dummyCustomers.filter((customer) =>
      conditions.reduce((result, condition) => {
        const fieldValue = customer[condition.field];
        const targetValue = parseFloat(condition.value);
        if (!fieldValue || isNaN(targetValue)) return result;

        const match = compare(fieldValue, condition.operator, targetValue);

        return condition.logic === "AND" ? result && match : result || match;
      }, true)
    );

    setFilteredCustomers(filtered);
    setMessageType("success");
    setMessage(`Filtered customers loaded. Segment size: ${filtered.length}`);
  };

  const createSegment = () => {
    setMessage(`Segment "${segmentName}" created successfully!`);
    setMessageType("success");
    setSegmentCreated(true);
    setSegmentId("dummy-segment-id");
  };

  const sendMessage = () => {
    setMessage(`Message sent to ${filteredCustomers.length} customers successfully!`);
    setMessageType("success");
  };

  const viewPastCampaigns = () => {
    navigate("/past-campaigns", { state: { segmentId } });
  };

  return (
    <div className="container mt-3">
      <h2 className="mt-2">Create Audience Segment</h2>

      {message && (
        <div
          className={`alert ${
            messageType === "success" ? "alert-success" : "alert-danger"
          }`}
        >
          {message}
        </div>
      )}

      <form className="mt-3" onSubmit={(e) => e.preventDefault()}>
        <div className="mb-3">
          <label htmlFor="segmentName" className="form-label">
            Segment Name
          </label>
          <input
            type="text"
            id="segmentName"
            className="form-control"
            value={segmentName}
            onChange={(e) => setSegmentName(e.target.value)}
            placeholder="Enter segment name"
            required
          />
        </div>

        {conditions.map((condition, index) => (
          <div key={index} className="mb-3">
            <div className="d-flex align-items-center">
              <select
                className="form-select me-2"
                onChange={(e) => updateCondition(index, "field", e.target.value)}
                value={condition.field}
              >
                <option value="">Select field</option>
                <option value="totalSpend">Net Spend</option>
                <option value="visits">Visits</option>
                <option value="lastVisitDate">Last Visit (months ago)</option>
              </select>

              <select
                className="form-select me-2"
                onChange={(e) => updateCondition(index, "operator", e.target.value)}
                value={condition.operator}
              >
                <option value="">Select operator</option>
                <option value=">">Greater than</option>
                <option value="<">Less than</option>
                <option value=">=">Greater than or equal to</option>
                <option value="<=">Less than or equal to</option>
              </select>

              <input
                type="number"
                className="form-control me-2"
                placeholder="Enter value"
                onChange={(e) => updateCondition(index, "value", e.target.value)}
                value={condition.value}
              />

              {index > 0 && (
                <select
                  className="form-select me-2"
                  onChange={(e) => updateCondition(index, "logic", e.target.value)}
                  value={condition.logic}
                >
                  <option value="AND">AND</option>
                  <option value="OR">OR</option>
                </select>
              )}

              <button
                type="button"
                className="btn btn-danger"
                onClick={() => deleteCondition(index)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-secondary mt-3"
          onClick={addCondition}
        >
          Add Condition
        </button>
      </form>

      <div className="d-flex align-items-center justify-content-between mt-3">
        <div>
          <button
            type="button"
            className="btn btn-info mx-2"
            onClick={viewFilteredCustomers}
          >
            View Filtered Customers
          </button>

          <button
            type="button"
            className="btn btn-primary mx-2"
            onClick={createSegment}
          >
            Create Segment
          </button>
        </div>

        {segmentCreated && (
          <div
            style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}
          >
            <input
              type="text"
              className="form-control mb-2"
              style={{ width: "300px" }}
              placeholder="Enter message (e.g., Hi [Name], here’s 10% off on your next order!)"
              value={messageTemplate}
              onChange={(e) => setMessageTemplate(e.target.value)}
            />
            <button className="btn btn-primary" onClick={sendMessage}>
              Send Message
            </button>
            <button className="btn btn-secondary mt-2" onClick={viewPastCampaigns}>
              View Past Campaigns
            </button>
          </div>
        )}
      </div>

      {filteredCustomers.length > 0 && (
        <div className="customer-list mt-4">
          <h3>Filtered Customers</h3>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {filteredCustomers.map((customer) => (
              <li
                key={customer.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  padding: "10px",
                  margin: "5px 0",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <strong>{customer.name}</strong> - {customer.totalSpend} spent -{" "}
                {customer.visits} visits
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CreateSegment;
