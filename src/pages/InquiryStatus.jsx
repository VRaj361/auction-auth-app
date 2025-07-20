// pages/InquiryStatus.jsx
import { useEffect, useState } from "react";
import { BounceLoader } from "react-spinners";

function InquiryStatus() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}api/inquiry-status/all?userId=${user._id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.orders);
          setLoading(false);
        }
      })
      .catch((err) => { console.error(err); setLoading(false);});
  }, [user._id]);

  return (
    <div className="inquiry-statuss-container">
      <h2>Your Inquiry Statuss</h2>
      <BounceLoader
        color={"#00695c"}
        loading={loading}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      {orders.length === 0 && !loading ? (
        <p style={{color: "#004d40"}}>No purchase found.</p>
      ) : (
        <div className="inquiry-status-list">
          {orders.map((order) => (
            <div key={order.inquiryId} className="inquiry-status-card">
              <h3>{order.title}</h3>
              <small>ID: {order.inquiryNumber}</small>
              <p className="status">
                Status:{" "}
                <span className={`status ${order.status}`}>
                  {order.status.toUpperCase()}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InquiryStatus;
