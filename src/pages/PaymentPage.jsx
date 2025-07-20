import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { BounceLoader } from 'react-spinners';
import "../App.css"; // global styles
// import "./PaymentPage.css"; // component styles (table, buttons, etc.)

const UNIT_PRICE = 500; // ₹ per Qty (change as needed)

function PaymentPage() {
  const { id: purchaseOrderId } = useParams();
  const baseUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:8000/";
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  }, []);

  // wizard step 1..4
  const [step, setStep] = useState(1);

  // Step 1 files (placeholders only)
  const [hrComplianceFile, setHrComplianceFile] = useState(null);
  const [techQtyFile, setTechQtyFile] = useState(null);

  // Step 2 qty (amount derived)
  const [qty, setQty] = useState("");

  // Step 3 signature (placeholder)
  const [signatureFile, setSignatureFile] = useState(null);

  // Payment History
  const [history, setHistory] = useState([]); // [{_id, createdAt, qtyNumber, amount}, ...]
  const [loadingHistory, setLoadingHistory] = useState(true);

  // saved payment returned from backend after final submit
  const [savedPayment, setSavedPayment] = useState(null);

  // derived total amount
  const totalAmount = useMemo(() => (Number(qty) || 0) * UNIT_PRICE, [qty]);

  // Format date/time to IST
  const formatIST = (iso) =>
    iso
      ? new Date(iso).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata",
        })
      : "-";

  // Fetch payment history (Step 1 display)
  useEffect(() => {
    const fetchHistory = async () => {
      if (!purchaseOrderId) return;
      setLoadingHistory(true);
      try {
        const url = `${baseUrl}api/payments/history?purchaseOrderId=${purchaseOrderId}` +
          (user?._id ? `&userId=${user._id}` : "");
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setHistory(data.history || []);
        } else {
          toast.error(data.message || "Failed to load payment history");
        }
      } catch (err) {
        console.error(err);
        toast.error("Server error loading payment history");
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [baseUrl, purchaseOrderId, user?._id]);

  // ----------------------- Handlers ---------------------------------
  const handleQtyChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value)) setQty(value);
  };

  const nextFromStep1 = () => {
    setStep(2);
  };

  const nextFromStep2 = () => {
    if (!qty || Number(qty) <= 0) {
      toast.error("Please enter a valid quantity.");
      return;
    }
    setStep(3);
  };

  const finalSubmit = async () => {
    if (!user?._id) {
      toast.error("User not found.");
      return;
    }
    if (!purchaseOrderId) {
      toast.error("Missing Purchase Order ID.");
      return;
    }

    try {
      const res = await fetch(`${baseUrl}api/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          purchaseOrderId,
          qtyNumber: Number(qty),
          amount: totalAmount,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Payment submitted.");
        const newPayment = data.payment || {
          _id: `temp-${Date.now()}`,
          createdAt: new Date().toISOString(),
          qtyNumber: Number(qty),
          amount: totalAmount,
        };
        setSavedPayment(newPayment);
        // append to local history so step1 table reflects new payment if user returns
        setHistory((prev) => [newPayment, ...prev]);
        setStep(4);
      } else {
        toast.error(data.message || "Failed to submit payment");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error submitting payment");
    }
  };

  // placeholder file selectors
  const onHrComplianceFile = (e) => {
    const f = e.target.files?.[0];
    if (f && f.type !== "application/pdf") {
      toast.error("Please upload a PDF file.");
      return;
    }
    setHrComplianceFile(f || null);
    if (f) toast.success("HR Compliance uploaded.");
  };

  const onTechQtyFile = (e) => {
    const f = e.target.files?.[0];
    if (f && f.type !== "application/pdf") {
      toast.error("Please upload a PDF file.");
      return;
    }
    setTechQtyFile(f || null);
    if (f) toast.success("Technical Qty Sheet uploaded.");
  };

  const onSignatureFile = (e) => {
    const f = e.target.files?.[0];
    if (f && f.type !== "application/pdf") {
      toast.error("Please upload a PDF file.");
      return;
    }
    setSignatureFile(f || null);
    if (f) toast.success("Signature uploaded.");
  };

  // ----------------------- Render Helpers ---------------------------
  const renderHistoryTable = () => {
    // if (loadingHistory) return <p>Loading payment history...</p>;
    if (loadingHistory) 
      return (
        <BounceLoader
          color={"#00695c"}
          loading={loadingHistory}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      );
    if (!history.length) return <p>No prior payments.</p>;
    return (
      <table className="payment-history-table">
        <thead>
          <tr>
            <th>Date / Time (IST)</th>
            <th>Qty</th>
            <th>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h) => (
            <tr key={h._id}>
              <td>{formatIST(h.createdAt)}</td>
              <td>{h.qtyNumber}</td>
              <td>{h.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // ----------------------- Render ----------------------------------
  return (
    <div className="payment-container">
      <h2 className="payment-header">Payment</h2>

      {/* Step 1 */}
      {step === 1 && (
        <div className="payment-step">
          <h3>Step 1: Submit Your Required Documents</h3>

          <div className="payment-history-block">
            <h4>Payment History</h4>
            {renderHistoryTable()}
          </div>

          <div className="file-section">
            <label>HR Compliance:</label>
            <input type="file" accept="application/pdf" onChange={onHrComplianceFile} />
            {hrComplianceFile && <small>{hrComplianceFile.name}</small>}
          </div>
          <div className="file-section">
            <label>Technical Qty Sheet:</label>
            <input type="file" accept="application/pdf" onChange={onTechQtyFile} />
            {techQtyFile && <small>{techQtyFile.name}</small>}
          </div>

          <button className="next-btn" onClick={nextFromStep1}>
            Next Step
          </button>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="payment-step">
          <h3>Step 2: Submit Quantity</h3>
          <p>
            <strong>Unit Price:</strong> ₹{UNIT_PRICE}
          </p>
          <div className="qty-input">
            <label>Enter Quantity:</label>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={handleQtyChange}
              placeholder="Enter Qty"
              style={{"width": "80%"}}
            />
          </div>
          {qty > 0 && (
            <p className="total-amount">
              <strong>Total Amount:</strong> ₹{totalAmount}
            </p>
          )}
          <button className="next-btn" onClick={nextFromStep2}>
            Next Step
          </button>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="payment-step">
          <h3>Step 3: Download Your Invoice</h3>
          <button
            className="download-btn"
            onClick={() => toast.success("Invoice downloaded")}
          >
            Download Invoice
          </button>
          <div className="file-section">
            <label>Upload Signed Invoice:</label>
            <input type="file" accept="application/pdf" onChange={onSignatureFile} />
            {signatureFile && <small>{signatureFile.name}</small>}
          </div>
          <button className="next-btn" onClick={finalSubmit}>
            Final Submission
          </button>
        </div>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <div className="payment-step">
          <h3>Payment Completed</h3>
          <p>
            <strong>Payment Amount:</strong> ₹{savedPayment?.amount ?? totalAmount}
          </p>
          <button
            className="download-btn"
            onClick={() => toast.success("Receipt downloaded")}
          >
            Download Payment Receipt
          </button>
        </div>
      )}
    </div>
  );
}

export default PaymentPage;
