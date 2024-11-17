import React, { useState } from "react";
import styles from "../Styles/PrevSegments.module.css"; // Assuming you have a stylesheet
import { useNavigate } from "react-router-dom";

export default function PrevSegments() {

    const navigate = useNavigate();
  // Dummy data for segments
  const [segments] = useState([
    {
      _id: "1",
      name: "High Spenders",
      audienceSize: 120,
      createdAt: new Date().toISOString(),
    },
    {
      _id: "2",
      name: "Frequent Visitors",
      audienceSize: 200,
      createdAt: new Date().toISOString(),
    },
    {
      _id: "3",
      name: "Loyal Customers",
      audienceSize: 150,
      createdAt: new Date().toISOString(),
    },
  ]);

  // Dummy data for campaigns
  const [messageTemplate, setMessageTemplate] = useState("");
  const [activeSegmentId, setActiveSegmentId] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Dummy event handlers
  const handleViewCampaigns = (segmentId) => {
    navigate("/past-campaigns", { state: { segmentId: "123" } });
  };

  const handleDeleteSegment = (segmentId) => {
    alert(`Delete segment with ID: ${segmentId}`);
  };

  const handleSendMessage = (segmentId) => {
    if (!messageTemplate.trim()) {
      setMessageType("error");
      setMessage("Message cannot be empty");
      return;
    }

    setMessage(`Message sent successfully to segment ID: ${segmentId}`);
    setMessageType("success");
    setActiveSegmentId(null);
    setMessageTemplate("");
  };

  return (
    <div className={styles.container}>
      <h2>Segments</h2>

      {message && (
        <div
          className={`alert ${
            messageType === "success" ? "alert-success" : "alert-danger"
          }`}
        >
          {message}
        </div>
      )}

      {segments.length > 0 ? (
        <table className="table table-striped table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Segment Name</th>
              <th>Segment Size</th>
              <th>Created At</th>
              <th>Actions</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {segments.map((segment) => (
              <tr key={segment._id}>
                <td>{segment.name}</td>
                <td>{segment.audienceSize}</td>
                <td>{new Date(segment.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleViewCampaigns(segment._id)}
                  >
                    View Campaigns
                  </button>
                  <button
                    onClick={() =>
                      setActiveSegmentId(
                        activeSegmentId === segment._id ? null : segment._id
                      )
                    }
                    className="btn btn-info btn-sm mx-2"
                  >
                    Send Campaign
                  </button>
                  {activeSegmentId === segment._id && (
                    <div className="mt-2">
                      <input
                        type="text"
                        className="form-control mb-2"
                        style={{ width: "300px" }}
                        placeholder="Hi [Name], here’s 10% off on your next order!"
                        value={messageTemplate}
                        onChange={(e) => setMessageTemplate(e.target.value)}
                      />
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleSendMessage(segment._id)}
                      >
                        Send Message
                      </button>
                    </div>
                  )}
                </td>
                <td className="text-center">
                  <i
                    className="fas fa-trash text-danger"
                    style={{
                      cursor: "pointer",
                      fontSize: "18px",
                      padding: "4px",
                    }}
                    onClick={() => handleDeleteSegment(segment._id)}
                    title="Delete Segment"
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No segments found.</p>
      )}
    </div>
  );
}
