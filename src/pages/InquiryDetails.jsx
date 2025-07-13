// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';

// function InquiryDetails() {
//   const { id } = useParams();
//   const [inquiry, setInquiry] = useState(null);
//   const [status, setStatus] = useState('pending');
//   const user = JSON.parse(localStorage.getItem('user'));

//   useEffect(() => {
//     fetch(`http://localhost:8000/api/inquiries/${id}`)
//       .then((res) => res.json())
//       .then((data) => setInquiry(data))
//       .catch((err) => console.error(err));

//     // Fetch inquiry status for this user and inquiry
//     fetch(`http://localhost:8000/api/inquiry-status?userId=${user._id}&inquiryId=${id}`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success && data.status) {
//           setStatus(data.status);
//         }
//       })
//       .catch((err) => console.error(err));
//   }, [id, user._id]);

//   const handleReject = async () => {
//     console.log('in')
//     const user = JSON.parse(localStorage.getItem('user'));
//     const res = await fetch('http://localhost:8000/api/inquiry-status', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         userId: user._id,
//         inquiryNumber: inquiry.inquiryNumber,
//         inquiryId: id,
//         status: 'rejected'
//       })
//     });
//     const data = await res.json();
//     if (data.success) setStatus('rejected');
//   };

//   if (!inquiry) return <p>Loading...</p>;

//   return (
//     <div>
//       <h2>{inquiry.title}</h2>
//       <p>{inquiry.description}</p>
//       <small>Inquiry Number: {inquiry.inquiryNumber}</small>

//       {status === 'pending' && (
//         <div style={{ marginTop: '20px' }}>
//           <p>Are you ready to purchase order?</p>
//           <button onClick={() => alert('Handle accept logic here')}>Accept</button>
//           <button onClick={handleReject} style={{ marginLeft: '10px' }}>Reject</button>
//         </div>
//       )}

//       {status === 'rejected' && (
//         <p style={{ color: 'red', marginTop: '20px' }}>
//           You rejected the inquiry.
//         </p>
//       )}

//       {status === 'accepted' && (
//         <p style={{ color: 'green', marginTop: '20px' }}>
//           You accepted the inquiry.
//         </p>
//       )}
//     </div>
//   );
// }

// export default InquiryDetails;

// pages/InquiryDetails.jsx
// ----------------------------------
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import toast from 'react-hot-toast'
import "../App.css";

function InquiryDetails() {
  const { id } = useParams();
  const [inquiry, setInquiry] = useState(null);
  const [status, setStatus] = useState("pending");
  const [step, setStep] = useState(0);
  const [checkedSteps, setCheckedSteps] = useState({});
  const [showSteps, setShowSteps] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  const stepContent = {
    1: (
      <p>Step 1: Please read and agree to the general terms and conditions.</p>
    ),
    2: <p>Step 2: Review the Technical Specification.</p>,
    3: (
      <>
      <p>Step 3: Review the Technical Deviation.</p>
      <iframe src="/aristo.pdf" width="100%" height="500px" title="PDF Terms" />
      </>
    ),
    4: <p>Step 4: Confirm Commercial.</p>,
    5: <p>Step 5: Review the Commercial Deviation.</p>,
    6: (
      <>
      <p>Step 6: All Document checklist.</p>
      {/* checkboxes */}
       {/* <label className="step-checkbox">
        <input
          type="checkbox"
          checked={checkedSteps[s] || false}
          onChange={() => handleCheckboxChange(s)}
        />{" "}
        I agree to the terms
      </label> */}
      </>
    ),
  };

  useEffect(() => {
    fetch(`http://localhost:8000/api/inquiries/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setInquiry(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    fetch(
      `http://localhost:8000/api/inquiry-status?userId=${user._id}&inquiryId=${id}`
    )
      .then((res) => res.json())
      .then((data) => {
        setLoading1(false);
        if (data.success && data.status) {
          setStatus(data.status);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading1(false);
      });
  }, [id, user._id]);

  const handleReject = async () => {
    const res = await fetch("http://localhost:8000/api/inquiry-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user._id,
        inquiryNumber: inquiry.inquiryNumber,
        inquiryId: id,
        status: "rejected",
      }),
    });
    const data = await res.json();
    if (data.success) { setStatus("rejected"); toast.success('You have rejected the inquiry.')};
  };

  const handleCheckboxChange = (stepNumber) => {
    setCheckedSteps((prev) => ({ ...prev, [stepNumber]: !prev[stepNumber] }));
    if (!checkedSteps[stepNumber] && step < 6) {
      setStep(step + 1);
    }
  };

  const handleAccept = () => {
    setShowSteps(true);
    setStep(1);
  };

  const handleAcceptSubmit = async () => {
    const res = await fetch("http://localhost:8000/api/inquiry-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user._id,
        inquiryNumber: inquiry.inquiryNumber,
        inquiryId: id,
        status: "accepted",
      }),
    });
    const data = await res.json();
    if (data.success) { setStatus("accepted"); toast.success('You have accepted the inquiry.'); };
  };

  if (!inquiry)
    return (
      <BounceLoader
        color={"#00695c"}
        loading={loading || loading1}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    );

  return (
    <div className="inquiry-detail-container">
      <BounceLoader
        color={"#00695c"}
        loading={loading || loading1}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      {!loading && !loading1 && <>
      <h2>{inquiry.title}</h2>
      <p className="inquiry-description">{inquiry.description}</p>
      <small className="inquiry-number">
        Inquiry Number: {inquiry.inquiryNumber}
      </small>

      {status === "pending" && !showSteps && (
        <div className="decision-section">
          <p style={{ color: "#004d40" }}>Are you ready to purchase order?</p>
          <button className="accept-btn" onClick={handleAccept}>
            Accept
          </button>
          <button className="reject-btn" onClick={handleReject}>
            Reject
          </button>
        </div>
      )}

      {status === "rejected" && (
        <p className="status-rejected">You have rejected the inquiry.</p>
      )}

      {status === "pending" && showSteps && (
        <div className="steps-section">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div
              key={s}
              className="step-content"
              style={{ display: s === step ? "block" : "none" }}
            >
              {stepContent[s]}
              <label className="step-checkbox">
                <input
                  type="checkbox"
                  checked={checkedSteps[s] || false}
                  onChange={() => handleCheckboxChange(s)}
                />{" "}
                I agree to the terms
              </label>
            </div>
          ))}

          {step === 6 && checkedSteps[6] && (
            <button className="submit-btn" onClick={handleAcceptSubmit}>
              Submit in Mail
            </button>
          )}
        </div>
      )}

      {status === "accepted" && (
        <p className="status-accepted">You have accepted the inquiry.</p>
      )}
      </>}
    </div>
  );
}

export default InquiryDetails;
