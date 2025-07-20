import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../App.css';

function PurchaseOrder() {
  const baseUrl = process.env.REACT_APP_SERVER_URL; // e.g. http://localhost:8000/
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${baseUrl}api/purchase-orders`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setPurchaseOrders(data.purchaseOrders || []);
        else toast.error('Failed to load purchase orders');
      })
      .catch(err => {
        console.error(err);
        toast.error('Server error fetching purchase orders');
      })
      .finally(() => setLoading(false));
  }, [baseUrl]);

  if (loading) return <p style={{color:'#004d40'}}>Loading purchase orders...</p>;

  return (
    <div className="po-list-container">
      <h2>Purchase Orders</h2>
      {purchaseOrders.length === 0 ? (
        <p>No purchase orders found.</p>
      ) : (
        <div className="po-list">
          {purchaseOrders.map((po) => (
            <Link
              key={po._id}
              to={`/dashboard/purchase-order/${po._id}`}
              className="po-card-link"
            >
              <div className="po-card">
                <h3>{po.title}</h3>
                <p>{po.description}</p>
                <small>PO#: {po.purchaseNumber}</small>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default PurchaseOrder;
