import { useState } from 'react';
// import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../App.css';

function AmendmentRequest() {
//   const { id } = useParams(); // purchase order ID
  const [decision, setDecision] = useState(null); // null | 'accepted' | 'rejected'

  const handleDecision = (action) => {
    setDecision(action);
    toast.success(`You ${action} the amendment request`);
  };

  return (
    <div className="amendment-request-container">
      <h2>Amendment Request</h2>
      {/* <p><strong>Purchase Order ID:</strong> {id}</p> */}
      <p><strong>Title:</strong> Change in the Purchase Order</p>
      <p><strong>Description:</strong> Some details about the amendment request...</p>
      <p>Are you accepting the amendment request?</p>

      {decision ? (
        <p className={`${decision === "accepted" ? "status-accepted" : "status-rejected"}`}>
          You {decision} the amendment request.
        </p>
      ) : (
        <div className="amendment-actions">
          <button onClick={() => handleDecision('accepted')} className="accept-btn">
            Accept
          </button>
          <button onClick={() => handleDecision('rejected')} className="reject-btn">
            Reject
          </button>
        </div>
      )}
    </div>
  );
}

export default AmendmentRequest;
