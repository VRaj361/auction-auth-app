// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';

// function InquiryDetails() {
//   const { id } = useParams();
//   const [inquiry, setInquiry] = useState(null);
//   const [status, setStatus] = useState('pending');
//   const user = JSON.parse(localStorage.getItem('user'));

//   useEffect(() => {
//     fetch(`${process.env.REACT_APP_SERVER_URL}api/inquiries/${id}`)
//       .then((res) => res.json())
//       .then((data) => setInquiry(data))
//       .catch((err) => console.error(err));

//     // Fetch inquiry status for this user and inquiry
//     fetch(`${process.env.REACT_APP_SERVER_URL}api/inquiry-status?userId=${user._id}&inquiryId=${id}`)
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
//     const res = await fetch('${process.env.REACT_APP_SERVER_URL}api/inquiry-status', {
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
//           <p>Are you ready to Inquiry Status?</p>
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
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { BounceLoader } from "react-spinners";
// import toast from 'react-hot-toast'
// import "../App.css";

// function InquiryDetails() {
//   const { id } = useParams();
//   const [inquiry, setInquiry] = useState(null);
//   const [status, setStatus] = useState("pending");
//   const [step, setStep] = useState(0);
//   const [checkedSteps, setCheckedSteps] = useState({});
//   const [showSteps, setShowSteps] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [loading1, setLoading1] = useState(true);
//   const user = JSON.parse(localStorage.getItem("user"));

//   const stepContent = {
//     1: (
//       <p>Step 1: Please read and agree to the general terms and conditions.</p>
//     ),
//     2: <p>Step 2: Review the Technical Specification.</p>,
//     3: (
//       <>
//       <p>Step 3: Review the Technical Deviation.</p>
//       <iframe src="/aristo.pdf" width="100%" height="500px" title="PDF Terms" />
//       </>
//     ),
//     4: <p>Step 4: Confirm Commercial.</p>,
//     5: <p>Step 5: Review the Commercial Deviation.</p>,
//     6: (
//       <>
//       <p>Step 6: All Document checklist.</p>
//       {/* checkboxes */}
//        {/* <label className="step-checkbox">
//         <input
//           type="checkbox"
//           checked={checkedSteps[s] || false}
//           onChange={() => handleCheckboxChange(s)}
//         />{" "}
//         I agree to the terms
//       </label> */}
//       </>
//     ),
//   };

//   useEffect(() => {
//     fetch(`${process.env.REACT_APP_SERVER_URL}api/inquiries/${id}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setInquiry(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         setLoading(false);
//       });

//     fetch(
//       `${process.env.REACT_APP_SERVER_URL}api/inquiry-status?userId=${user._id}&inquiryId=${id}`
//     )
//       .then((res) => res.json())
//       .then((data) => {
//         setLoading1(false);
//         if (data.success && data.status) {
//           setStatus(data.status);
//         }
//       })
//       .catch((err) => {
//         console.error(err);
//         setLoading1(false);
//       });
//   }, [id, user._id]);

//   const handleReject = async () => {
//     const res = await fetch("${process.env.REACT_APP_SERVER_URL}api/inquiry-status", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         userId: user._id,
//         inquiryNumber: inquiry.inquiryNumber,
//         inquiryId: id,
//         status: "rejected",
//       }),
//     });
//     const data = await res.json();
//     if (data.success) { setStatus("rejected"); toast.success('You have accepted the enquiry.')};
//   };

//   const handleCheckboxChange = (stepNumber) => {
//     setCheckedSteps((prev) => ({ ...prev, [stepNumber]: !prev[stepNumber] }));
//     if (!checkedSteps[stepNumber] && step < 6) {
//       setStep(step + 1);
//     }
//   };

//   const handleAccept = () => {
//     setShowSteps(true);
//     setStep(1);
//   };

//   const handleAcceptSubmit = async () => {
//     const res = await fetch("${process.env.REACT_APP_SERVER_URL}api/inquiry-status", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         userId: user._id,
//         inquiryNumber: inquiry.inquiryNumber,
//         inquiryId: id,
//         status: "accepted",
//       }),
//     });
//     const data = await res.json();
//     if (data.success) { setStatus("accepted"); toast.success('You have accepted the enquiry.'); };
//   };

//   if (!inquiry)
//     return (
//       <BounceLoader
//         color={"#00695c"}
//         loading={loading || loading1}
//         size={50}
//         aria-label="Loading Spinner"
//         data-testid="loader"
//       />
//     );

//   return (
//     <div className="inquiry-detail-container">
//       <BounceLoader
//         color={"#00695c"}
//         loading={loading || loading1}
//         size={50}
//         aria-label="Loading Spinner"
//         data-testid="loader"
//       />
//       {!loading && !loading1 && <>
//       <h2>{inquiry.title}</h2>
//       <p className="inquiry-description">{inquiry.description}</p>
//       <small className="inquiry-number">
//         Inquiry Number: {inquiry.inquiryNumber}
//       </small>

//       {status === "pending" && !showSteps && (
//         <div className="decision-section">
//           <p style={{ color: "#004d40" }}>Are you ready to Inquiry Status?</p>
//           <button className="accept-btn" onClick={handleAccept}>
//             Accept
//           </button>
//           <button className="reject-btn" onClick={handleReject}>
//             Reject
//           </button>
//         </div>
//       )}

//       {status === "rejected" && (
//         <p className="status-rejected">You have accepted the enquiry.</p>
//       )}

//       {status === "pending" && showSteps && (
//         <div className="steps-section">
//           {[1, 2, 3, 4, 5, 6].map((s) => (
//             <div
//               key={s}
//               className="step-content"
//               style={{ display: s === step ? "block" : "none" }}
//             >
//               {stepContent[s]}
//               <label className="step-checkbox">
//                 <input
//                   type="checkbox"
//                   checked={checkedSteps[s] || false}
//                   onChange={() => handleCheckboxChange(s)}
//                 />{" "}
//                 I agree to the terms
//               </label>
//             </div>
//           ))}

//           {step === 6 && checkedSteps[6] && (
//             <button className="submit-btn" onClick={handleAcceptSubmit}>
//               Submit in Mail
//             </button>
//           )}
//         </div>
//       )}

//       {status === "accepted" && (
//         <p className="status-accepted">You have accepted the enquiry.</p>
//       )}
//       </>}
//     </div>
//   );
// }

// export default InquiryDetails;

// ---------------------------

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import toast from "react-hot-toast";
import "../App.css";

function InquiryDetails() {
  const { id } = useParams();
  const [inquiry, setInquiry] = useState(null);
  const [status, setStatus] = useState("pending");
  const [step, setStep] = useState(0);
  const [checkedFinal, setCheckedFinal] = useState({});
  const [showSteps, setShowSteps] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  const stepTitle = {
    1: <span>Confirm remark on Description.</span>,
    2: <span>Confirm submission of Technical specification.</span>,
    3: <span>Confirm remarks and submission of Technical Deviation.</span>,
    4: <span>Confirm submission of Commercial document.</span>,
    5: <span>Confirm remark and submissoin of Commercial Deviation.</span>,
  };

  const stepContent = {
    1: (
      <>
        <p>Step 1: Please find below description for Enquiry.</p>
        <p>
          I hereby declare that I have thoroughly read, reviewed, and understood
          all documents, annexures, and materials provided, that my remarks are
          based solely on these materials to the best of my knowledge and
          belief, and that by proceeding to next option acknowledge this
          submission as my final and formal position.
        </p>
      </>
    ),
    2: (
      <>
        <p>Step 2: Please find below Technical documents.</p>
        <iframe
          src="/technicaldocument.pdf"
          width="100%"
          height="500px"
          title="PDF Terms"
        />
        <p>
          I hereby declare that I have thoroughly read, reviewed, and understood
          all documents, annexures, and materials provided, that my remarks are
          based solely on these materials to the best of my knowledge and
          belief, and that by proceeding to select one of the following
          options-Agreed, Agreed with Deviation (subject to the deviations
          stated in my remarks), or Not Agreed-I acknowledge this submission as
          my final and formal position.
        </p>
      </>
    ),
    3: (
      <>
        <p>Step 3: Please provide remarks in Technical Deviation Sheet.</p>
        <iframe
          src="/deviationsheet.pdf"
          width="100%"
          height="500px"
          title="PDF Terms"
        />
        <p>
          I hereby declare that I have thoroughly read, reviewed, and understood
          all documents, annexures, and materials provided, that my remarks are
          based solely on these materials to the best of my knowledge and
          belief, and that by proceeding to next option acknowledge this
          submission as my final and formal position.
        </p>
      </>
    ),
    4: (
      <>
        <p>
          Step 4: Please provide your rates and remarks on terms and conditions
          in below Commercial document.
        </p>
        <iframe
          src="/commercialdocument.pdf"
          width="100%"
          height="500px"
          title="PDF Terms"
        />
        <p>
          I hereby declare that I have thoroughly read, reviewed, and understood
          all documents, annexures, and materials provided, that my remarks are
          based solely on these materials to the best of my knowledge and
          belief, and that by proceeding to next option acknowledge this
          submission as my final and formal position.
        </p>
      </>
    ),
    5: (
      <>
        <p>Step 5: Please provide remarks in Commercial Deviation Sheet.</p>
        <iframe
          src="/deviationsheet.pdf"
          width="100%"
          height="500px"
          title="PDF Terms"
        />
        <p>
          I hereby declare that I have thoroughly read, reviewed, and understood
          all documents, annexures, and materials provided, that my remarks are
          based solely on these materials to the best of my knowledge and
          belief, and that by proceeding acknowledge this submission as my final
          and formal position.
        </p>
      </>
    ),
    6: (
      <>
        <b>All Document / Submission.</b>
        <div className="checkbox-group">
          {[1, 2, 3, 4, 5].map((i) => (
            <label key={i} className="step-checkbox">
              <input
                type="checkbox"
                checked={checkedFinal[i] || true}
                onChange={() =>
                  setCheckedFinal((prev) => ({ ...prev, [i]: !prev[i] }))
                }
              />
              {i}: {stepTitle[i]}
            </label>
          ))}
        </div>
        <p>
          I hereby declare that I have thoroughly read, reviewed, and understood
          all documents, annexures, and materials provided, that my remarks are
          based solely on these materials to the best of my knowledge and
          belief, and that by proceeding acknowledge this submission as my final
          and formal position.
        </p>
      </>
    ),
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}api/inquiries/${id}`)
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
      `${process.env.REACT_APP_SERVER_URL}api/inquiry-status?userId=${user._id}&inquiryId=${id}`
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
    const res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}api/inquiry-status`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          inquiryNumber: inquiry.inquiryNumber,
          inquiryId: id,
          status: "rejected",
        }),
      }
    );
    const data = await res.json();
    if (data.success) {
      setStatus("rejected");
      toast.success("You have rejected the enquiry.");
    }
  };

  const handleNextStep = () => {
    if (step < 6) setStep(step + 1);
  };

  const handleAccept = () => {
    setShowSteps(true);
    setStep(1);
  };

  const handleAcceptSubmit = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}api/inquiry-status`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          inquiryNumber: inquiry.inquiryNumber,
          inquiryId: id,
          status: "accepted",
        }),
      }
    );
    const data = await res.json();
    if (data.success) {
      setStatus("accepted");
      toast.success("You have accepted the enquiry.");
    }
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

  // const allFinalChecked =
  //   Object.values(checkedFinal).filter(Boolean).length === 5;

  return (
    <div className="inquiry-detail-container">
      <BounceLoader
        color={"#00695c"}
        loading={loading || loading1}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      {!loading && !loading1 && (
        <>
          <h2>{inquiry.title}</h2>
          <p className="inquiry-description">{inquiry.description}</p>
          <small className="inquiry-number">
            Inquiry Number: {inquiry.inquiryNumber}
          </small>

          {status === "pending" && !showSteps && (
            <div className="decision-section">
              <p style={{ color: "#004d40" }}>
                Are you interested in participating in this Enquiry?
              </p>
              <button className="accept-btn" onClick={handleAccept}>
                Accept
              </button>
              <button className="reject-btn" onClick={handleReject}>
                Reject
              </button>
            </div>
          )}

          {status === "rejected" && (
            <p className="status-rejected">You have rejected the enquiry.</p>
          )}

          {status === "pending" && showSteps && (
            <div className="steps-section">
              <div className="step-content">{stepContent[step]}</div>
              {step < 6 && step === 2 && (
                <>
                  <button className="next-btn" onClick={handleNextStep}>
                    Accept
                  </button>
                  <button
                    className="next-btn"
                    style={{ marginInline: "10px" }}
                    onClick={handleNextStep}
                  >
                    Reject
                  </button>
                  <button className="next-btn" onClick={handleNextStep}>
                    Accept with Deviation
                  </button>
                </>
              )}
              {step < 6 &&
                (step === 1 || step === 4 || step === 3 || step === 5) && (
                  <button className="next-btn" onClick={handleNextStep}>
                    Next
                  </button>
                )}
              {step === 6 && (
                <button
                  className="submit-btn"
                  onClick={handleAcceptSubmit}
                  // disabled={!allFinalChecked}
                  // style={{ opacity: allFinalChecked ? 1 : 0.5, cursor: allFinalChecked ? 'pointer' : 'not-allowed' }}
                  style={{ opacity: 1, cursor: "pointer" }}
                >
                  Submit in Mail
                </button>
              )}
            </div>
          )}

          {status === "accepted" && (
            <p className="status-accepted">You have accepted the enquiry.</p>
          )}
        </>
      )}
    </div>
  );
}

export default InquiryDetails;
