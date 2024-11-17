import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "../Styles/PastCampaigns.module.css"; // Import the CSS module

export const PastCampaigns = (props) => {
  const { setProgress } = props;
  const { state } = useLocation();
  const segmentId = state?.segmentId;

  const [customers, setCustomers] = useState([]);
  const [campaignsData, setCampaignsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCustomers, setExpandedCustomers] = useState(new Set());
  const [statistics, setStatistics] = useState({
    audienceSize: 0,
    messagesSent: 0,
    messagesFailed: 0,
    totalMessages: 0,
    successRate: 0,
    failureRate: 0,
  });

  useEffect(() => {
    const fetchSegmentData = async () => {
      setProgress(20);

      try {
        if (!segmentId) return;

        // Dummy Data
        const dummyCustomers = [
          { _id: "1", name: "Alice", email: "alice@example.com" },
          { _id: "2", name: "Bob", email: "bob@example.com" },
          { _id: "3", name: "Charlie", email: "charlie@example.com" },
        ];

        const dummyCampaigns = [
          {
            customerId: { _id: "1" },
            message: "Hello Alice, check out our latest offers!",
            status: "SENT",
            sentAt: "2024-11-17T12:00:00Z",
          },
          {
            customerId: { _id: "2" },
            message: "Hello Bob, don’t miss our discounts!",
            status: "FAILED",
            sentAt: "2024-11-16T10:00:00Z",
          },
          {
            customerId: { _id: "3" },
            message: "Hi Charlie, enjoy 20% off on your next purchase!",
            status: "SENT",
            sentAt: "2024-11-15T08:30:00Z",
          },
        ];

        setCustomers(dummyCustomers);
        setCampaignsData(dummyCampaigns);

        // Dummy statistics
        const audienceSize = dummyCustomers.length;
        const messagesSent = dummyCampaigns.filter((c) => c.status === "SENT").length;
        const messagesFailed = dummyCampaigns.filter((c) => c.status === "FAILED").length;
        const totalMessages = messagesSent + messagesFailed;
        const successRate = ((messagesSent / totalMessages) * 100).toFixed(2);
        const failureRate = ((messagesFailed / totalMessages) * 100).toFixed(2);

        setStatistics({
          audienceSize,
          messagesSent,
          messagesFailed,
          totalMessages,
          successRate,
          failureRate,
        });
      } catch (error) {
        console.error("Error fetching segment or campaigns:", error);
      } finally {
        setLoading(false);
      }
      setProgress(100);
    };

    fetchSegmentData();
  }, [segmentId, setProgress]);

  const toggleExpanded = (customerId) => {
    setExpandedCustomers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(customerId)) {
        newSet.delete(customerId);
      } else {
        newSet.add(customerId);
      }
      return newSet;
    });
  };

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return new Date(date).toLocaleString("en-US", options).replace(",", "");
  };

  if (!segmentId) {
    return <p>No segment selected. Please go back and select a segment.</p>;
  }

  // Group campaigns by customer
  const groupedCampaigns = customers.map((customer) => {
    const customerCampaigns = campaignsData.filter(
      (campaign) => campaign.customerId?._id === customer._id
    );
    return { customer, campaigns: customerCampaigns };
  });

  return (
    <div className={styles.container}>
      <div className={styles.titleArea}>
        <h2 className={styles.title}>Past Campaigns for Segment</h2>
      </div>

      {!loading && (
        <div className={styles.statistics}>
          <h5 className={styles.statsHeader}>Statistics</h5>
          <div className={styles.statsRow}>
            <div className={styles.statsItem}>
              <p>
                <strong>Audience Size:</strong> {statistics.audienceSize}
              </p>
              <p>
                <strong>Total Messages:</strong> {statistics.totalMessages}
              </p>
            </div>
            <div className={styles.statsItem}>
              <p>
                <strong>Messages Sent:</strong> {statistics.messagesSent}
              </p>
              <p>
                <strong>Messages Failed:</strong> {statistics.messagesFailed}
              </p>
            </div>
            <div className={styles.statsItem}>
              <p>
                <strong>Success Rate:</strong> {statistics.successRate}%
              </p>
              <p>
                <strong>Failure Rate:</strong> {statistics.failureRate}%
              </p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p>Loading data...</p>
      ) : groupedCampaigns.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Messages Sent</th>
            </tr>
          </thead>
          <tbody>
            {groupedCampaigns.map(({ customer, campaigns }, index) => (
              <tr key={index}>
                <td>
                  <strong>{customer.name}</strong>
                  <br />
                  <small className={styles.customerEmail}>{customer.email}</small>
                </td>
                <td>
                  <ul className={styles.campaignList}>
                    {(expandedCustomers.has(customer._id)
                      ? campaigns
                      : campaigns.slice(0, 3)
                    ).map((campaign, i) => (
                      <li key={i} className={styles.campaignItem}>
                        <strong>Message:</strong> {campaign.message}
                        <br />
                        <strong>Status:</strong>{" "}
                        <span
                          className={
                            campaign.status === "SENT"
                              ? styles.statusSent
                              : styles.statusFailed
                          }
                        >
                          {campaign.status}
                        </span>
                        <br />
                        <strong>Sent At:</strong> {formatDate(campaign.sentAt)}
                      </li>
                    ))}
                  </ul>
                  {campaigns.length > 3 && (
                    <button
                      className={styles.viewToggleButton}
                      onClick={() => toggleExpanded(customer._id)}
                    >
                      {expandedCustomers.has(customer._id) ? "View Less" : "View All"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available for this segment.</p>
      )}
    </div>
  );
};
