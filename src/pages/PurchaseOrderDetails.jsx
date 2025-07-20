import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BounceLoader } from 'react-spinners';
import '../App.css';


function PurchaseOrderDetails() {
  const { id } = useParams();
  const baseUrl = process.env.REACT_APP_SERVER_URL;
  const [po, setPo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // load PO
  useEffect(() => {
    setLoading(true);
    fetch(`${baseUrl}api/purchase-orders/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setPo(data.purchaseOrder);
        else toast.error('Purchase order not found');
      })
      .catch(err => {
        console.error(err);
        toast.error('Server error fetching purchase order');
      })
      .finally(() => setLoading(false));
  }, [id, baseUrl]);

  const handleDownload = () => {
    toast.success('Download successfully'); // placeholder
  };

  // const handleAction = (label) => {
  //   toast.success(`${label} clicked (coming soon)`);
  // };

  // if (loading) return <p style={{color:'#004d40'}}>Loading purchase order...</p>;
  if(loading) 
    return (
      <BounceLoader
        color={"#00695c"}
        loading={loading}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    );
  if (!po) return <p style={{color:'red'}}>Purchase order missing.</p>;

  return (
    <div className="po-detail-container">
      <h2>{po.title}</h2>
      
      <p className="po-detail-description" style={{color:'#004d40'}}>{po.description}</p>
      <small className="po-detail-number">PO#: {po.purchaseNumber}</small>

      <div className="po-download-row">
        <button className="po-download-btn" onClick={handleDownload}>
          Download Order
        </button>
      </div>

      <p className="po-status-row" style={{color:'#004d40'}}>
        Current Status: <span className={`po-status ${po.status}`}>{po.status.toUpperCase()}</span>
      </p>

      <div className="po-action-buttons">        
        <button onClick={() => navigate(`/dashboard/amendment/${po._id}`)}>
          Amendment Request from Procurement
        </button>
        <button onClick={() => navigate(`/dashboard/payment/${po._id}`)}>
          Payment
        </button>
        <button onClick={() => navigate(`/dashboard/query/${po._id}?type=technical`)}>
          Technical
        </button>
        <button onClick={() => navigate(`/dashboard/query/${po._id}?type=general`)}>
          Query
        </button>
      </div>
    </div>
  );
}

export default PurchaseOrderDetails;
